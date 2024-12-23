import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const OrderDetail = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const socket = useSelector(state => state.socket.socket)
  const user = useSelector(state => state.user.user)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    socket.emit('get-order-details', user.id, (data) => {
      if (data.success) {
        setOrders(data.orders)
      } else {
        toast(data.message)   
      }
    })
  },[])

  return (
    <div className='w-full p-4'>
      {/* Thanh tìm kiếm */}
      <div className='flex justify-between items-center mb-4'>
        <input 
          type='text'
          className='border border-gray-300 rounded-md p-2 w-1/2'
          placeholder='Tìm kiếm đơn hàng...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng đơn hàng */}
      <table className='w-full bg-white border border-gray-300'>
        <thead>
          <tr>
            <th className='border px-4 py-2'>STT</th>
            <th className='border px-4 py-2'>Hình ảnh</th>
            <th className='border px-4 py-2'>Tên sản phẩm</th>
            <th className='border px-4 py-2'>Giá</th>
            <th className='border px-4 py-2'>Số lượng</th>
            <th className='border px-4 py-2'>Phòng live</th>
            <th className='border px-4 py-2'>Mua lúc</th>
          </tr>
        </thead>
        {
          orders && orders.length > 0 ?
          <tbody>
            {orders.filter(order => 
              order.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((order, index) => (
              <tr key={order.id} className='text-center'>
                <td className='border px-4 py-2'>{index + 1}</td>
                <td className='border px-4 py-2'>
                  <img src={order.image} alt={order.name} className="w-16 h-16 object-cover" />
                </td>
                <td className='border px-4 py-2'>{order.name}</td>
                <td className='border px-4 py-2'>{order.price} VND</td>
                <td className='border px-4 py-2'>{order.quantity}</td>
                <td className='border px-4 py-2'>{order.livestream_id}</td>
                <td className='border px-4 py-2'>{order.created_at}</td>
              </tr>
            ))}
          </tbody>
          :
          <p className="text-center text-red-500 text-lg font-semibold">Không có đơn hàng nào.</p>
        }
      </table>
    </div>
  )
}

export default OrderDetail
