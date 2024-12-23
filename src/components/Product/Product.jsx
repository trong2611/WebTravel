import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { setProduct } from '../../redux/slices/productSlice'

const Product = () => {

  const socket = useSelector(state => state.socket.socket)
  const products = useSelector(state => state.product.product)
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  })

  // Xóa sản phẩm
  const handleDeleteProduct = (id) => {
    socket.emit('delete-product', id, user.id, (data) => {
      console.log(data);
      if (data.success) {
        toast(data.message)  
        dispatch(setProduct(data.product.products))
        console.log(data.product.products)
      } else {
        toast(data.message)   
      }
    })
  }

  // Hiển thị cửa sổ thêm product
  const handleAddProduct = () => {
    setIsAdding(true)
  }

  // Thêm product
  const handleSaveNewProduct = () => {
    const productToAdd = {
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      image: newProduct.image
    }
    socket.emit('add-product',user.id, productToAdd, (data) => {
      if (data.success) {
        toast(data.message)  
      } else {
        toast(data.message)   
      }
    })
    socket.emit('get-product-by-sellerId',user.id,(data) => {
      if (data.success) {
        dispatch(setProduct(data.products))
      } else {
        setMessage(data.message);  
      }
    })
    setIsAdding(false);
    setNewProduct({ name: '', description: '', price: '', stock: '', image: ''})
  }

  // Xử lí nhập dữ liệu input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewProduct({ ...newProduct, [name]: value });
    } else {
      setCurrentProduct({ ...currentProduct, [name]: value });
    }
  }

  const handleEditProduct = (product) => {
    setCurrentProduct(product)
    setIsEditing(true)
  }

  const handleSaveChanges = () => {
    console.log(currentProduct)
    socket.emit('update-product', currentProduct, user.id, (data) => {
      if (data.success) {
        toast(data.message)  
        dispatch(setProduct(data.product.products))
      } else {
        toast(data.message)   
      }
    })
    setIsEditing(false)
    setCurrentProduct(null)
  }

  return (
    <div className='w-full p-4'>
      {/* Thanh tìm kiếm và nút thêm sản phẩm */}
      <div className='flex justify-between items-center mb-4'>
        <input 
          type='text'
          className='border border-gray-300 rounded-md p-2 w-1/2'
          placeholder='Tìm kiếm sản phẩm...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={handleAddProduct}
          className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* Bảng sản phẩm */}
      <table className='w-full bg-white border border-gray-300'>
        <thead>
          <tr>
            <th className='border px-4 py-2'>STT</th>
            <th className='border px-4 py-2'>Tên sản phẩm</th>
            <th className='border px-4 py-2'>Đã bán</th>
            <th className='border px-4 py-2'>Tồn kho</th>
            <th className='border px-4 py-2'>Giá</th>
            <th className='border px-4 py-2'>Hành động</th>
          </tr>
        </thead>
        {
          products && products.length > 0 ? 
          <tbody>
          {products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((product, index) => (
            <tr key={product.id} className='text-center'>
              <td className='border px-4 py-2'>{index + 1}</td>
              <td className='border px-4 py-2'>{product.name}</td>
              <td className='border px-4 py-2'>{product.da_ban}</td>
              <td className='border px-4 py-2'>{product.stock}</td>
              <td className='border px-4 py-2'>{product.price} VND</td>
              <td className='border px-4 py-2'>
                <button 
                  onClick={() => handleEditProduct(product)}
                  className='bg-yellow-400 text-white px-3 py-1 mr-2 rounded-md hover:bg-yellow-500'
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
          :
          <p className="text-center text-red-500 text-lg font-semibold">{message}</p>
        }
        </table>

      {/* Modal thêm sản phẩm */}
      {isAdding && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-md shadow-md w-1/3'>
            <h2 className='text-lg font-bold mb-4'>Thêm sản phẩm mới</h2>
            <label className='block mb-2'>Tên sản phẩm:</label>
            <input
              type='text'
              name='name'
              value={newProduct.name}
              onChange={handleInputChange}
              className='border border-gray-300 rounded-md p-2 w-full mb-4'
            />
            <label className='block mb-2'>Mô tả:</label>
            <input
              type='text'
              name='description'
              value={newProduct.description}
              onChange={handleInputChange}
              className='border border-gray-300 rounded-md p-2 w-full mb-4'
            />
            <label className='block mb-2'>Giá sản phẩm:</label>
            <input
              type='number'
              name='price'
              value={newProduct.price}
              onChange={handleInputChange}
              className='border border-gray-300 rounded-md p-2 w-full mb-4'
            />
            <label className='block mb-2'>Số lượng tồn kho:</label>
            <input
              type='number'
              name='stock'
              value={newProduct.stock}
              onChange={handleInputChange}
              className='border border-gray-300 rounded-md p-2 w-full mb-4'
            />
            <label className='block mb-2'>Link hình ảnh:</label>
            <input
              type='text'
              name='image'
              value={newProduct.image}
              onChange={handleInputChange}
              className='border border-gray-300 rounded-md p-2 w-full mb-4'
            />
            <div className='flex justify-end'>
              <button
                onClick={() => setIsAdding(false)}
                className='bg-gray-400 text-white py-2 px-4 rounded-md mr-2 hover:bg-gray-500'
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNewProduct}
                className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa sản phẩm (chỉ chỉnh sửa mô tả) */}
      {isEditing && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-md shadow-md w-1/3'>
            <h2 className='text-lg font-bold mb-4'>Chỉnh sửa sản phẩm</h2>
            <label className='block mb-2'>Mô tả sản phẩm:</label>
            <input
              type='text'
              name='description'
              value={currentProduct.description}
              onChange={handleInputChange}
              className='border border-gray-300 rounded-md p-2 w-full mb-4'
            />
            <label className='block mb-2'>Giá sản phẩm:</label>
            <input
              type='number'
              name='price'
              value={currentProduct.price}
              onChange={handleInputChange}
              className='border border-gray-300 rounded-md p-2 w-full mb-4'
            />
            <label className='block mb-2'>Số lượng tồn kho:</label>
            <input
              type='number'
              name='stock'
              value={currentProduct.stock}
              onChange={handleInputChange}
              className='border border-gray-300 rounded-md p-2 w-full mb-4'
            />
            <div className='flex justify-end'>
              <button
                onClick={() => setIsEditing(false)}
                className='bg-gray-400 text-white py-2 px-4 rounded-md mr-2 hover:bg-gray-500'
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChanges}
                className='bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600'
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Product
