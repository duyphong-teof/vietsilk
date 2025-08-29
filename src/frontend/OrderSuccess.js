import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const OrderSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('id');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Đặt hàng thành công!</h1>
          <p className="mb-2">Mã đơn hàng của bạn:</p>
          <p className="font-mono text-lg bg-gray-100 inline-block px-4 py-2 rounded">
            {orderId}
          </p>
          <p className="mt-4">Cảm ơn bạn đã mua sắm tại VietSilk.</p>
          <a
            href="/"
            className="inline-block mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Quay về trang chủ
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
