import React, { useState } from 'react';

const BuyProduct = ({ product }) => {
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
  const [address, setAddress] = useState(""); // Địa chỉ người mua
  const [name, setName] = useState(""); // Tên người mua
  const [phone, setPhone] = useState(""); // Số điện thoại
  const [email, setEmail] = useState(""); // Email người mua

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dữ liệu đặt hàng sẽ được gửi
    const orderData = {
      product_id: product.id,
      seller_id: product.seller_id,
      quantity,
      total_price: product.price * quantity,
      address,
      name,
      phone,
      email,
    };

    console.log('Order Data:', orderData);

    // Gửi dữ liệu đặt hàng qua API hoặc thực hiện các hành động khác
    // fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) })
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Đặt Hàng</h2>

      <div className="flex mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-48 h-48 object-cover rounded-md mr-6"
        />
        <div className="flex flex-col justify-between">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <p className="text-gray-500">{product.description}</p>
          <div className="mt-4">
            <p className="text-lg font-bold text-gray-800">Giá: {product.price} VND</p>
            <p className="text-sm text-gray-600">Kho còn: {product.stock} sản phẩm</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên người mua</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Số lượng</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, e.target.value))}
            min="1"
            max={product.stock}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Đặt Hàng
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuyProduct;
