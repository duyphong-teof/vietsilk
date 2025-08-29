import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?._id || storedUser?.id;

      if (!userId) {
        setError('Bạn cần đăng nhập để xem đơn hàng.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/orders/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          setError(data.message || 'Không thể tải đơn hàng.');
        }
      } catch (err) {
        setError('Lỗi khi tải đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          Đơn hàng của tôi
        </h1>

        {loading && <p className="text-gray-600">Đang tải đơn hàng...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && orders.length === 0 && !error && (
          <p className="text-gray-600">Hiện chưa có đơn hàng nào.</p>
        )}

        {!loading && orders.map(order => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
            <div className="mb-3">
              <p className="text-sm text-gray-500">Mã đơn hàng</p>
              <p className="font-mono text-blue-600">{order._id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <div>
                <p><span className="font-medium">Trạng thái:</span> {order.status}</p>
                <p><span className="font-medium">Ngày đặt:</span> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p><span className="font-medium">Tổng tiền:</span> {order.total.toLocaleString('vi-VN')}₫</p>
                <p><span className="font-medium">Địa chỉ:</span> {order.address}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-2">Danh sách sản phẩm:</p>
              <ul className="space-y-2">
                {order.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size} | SL: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right text-gray-700 font-semibold">
                      {item.price.toLocaleString('vi-VN')}₫
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
