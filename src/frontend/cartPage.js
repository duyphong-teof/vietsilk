import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeItem, clearCart } from './redux/shopping_cart';
import Header from './Header';
import Footer from './Footer';
import EmptyShoppingBag from './EmptyShoppingCart';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCheckoutAll = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin địa chỉ giao hàng.');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?._id || storedUser?.id;

    if (!userId) {
      setError('Bạn cần đăng nhập để đặt hàng.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.image,
          })),
          total: totalPrice,
          address: `${name} - ${phone} - ${address}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(clearCart()); // 🧹 Xóa giỏ hàng
        navigate(`/order-success?id=${data.orderId}`); // 🔁 Chuyển hướng
      } else {
        setError(data.message || 'Đặt hàng thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi gửi đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      <Header />

      {cartItems.length === 0 ? (
        <EmptyShoppingBag onContinue={handleContinueShopping} />
      ) : (
        <>
          {cartItems.map(item => (
            <div
              key={item.id + item.size}
              className="flex items-center justify-between border-b border-gray-300 py-4 space-x-4 mx-10"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-silver-700">{item.price.toLocaleString('vi-VN')} VND</p>
                  <p className="text-sm text-silver-700">Kích cỡ: {item.size}</p>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1) {
                        dispatch(updateQuantity({ id: item.id, size: item.size, quantity: val }));
                      }
                    }}
                    className="border rounded px-2 py-1 mt-1 w-20"
                  />
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={() => dispatch(removeItem({ id: item.id, size: item.size }))}
                  className="text-red-600 hover:text-red-500 font-semibold"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}

          {/* Thông tin giao hàng */}
          <div className="mx-10 mt-8 p-4 border rounded max-w-xl">
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>

            {error && <p className="text-red-600 mb-3">{error}</p>}

            <div className="mb-3">
              <label className="block mb-1 font-medium" htmlFor="name">Tên người nhận</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập tên người nhận"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium" htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium" htmlFor="address">Địa chỉ giao hàng</label>
              <textarea
                id="address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập địa chỉ giao hàng"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8 mr-10 m-5">
            <button
              onClick={handleCheckoutAll}
              disabled={loading}
              className={`bg-black text-white hover:bg-white hover:text-black font-semibold rounded border border-black transition 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ width: '360px', height: '45px' }}
            >
              {loading
                ? 'Đang xử lý...'
                : `Thanh toán tất cả (${totalQuantity} sản phẩm) - ${totalPrice.toLocaleString('vi-VN')}₫`}
            </button>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
