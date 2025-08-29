import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Trợ giúp & Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-gray-900">Đặt hàng & Giao hàng</a></li>
              <li><a href="#" className="hover:text-gray-900">Trả hàng & Hoàn tiền</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Bộ sưu tập</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Đồ thể thao VietSilk</a></li>
              <li><a href="#" className="hover:text-gray-900">Đồ trẻ em VietSilk</a></li>
              <li><a href="#" className="hover:text-gray-900">Đồ bơi VietSilk</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Giới thiệu</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Giới thiệu về VietSilk</a></li>
              <li><a href="#" className="hover:text-gray-900">Thông báo về Quyền riêng tư</a></li>
              <li><a href="#" className="hover:text-gray-900">Điều khoản & Điều kiện</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Dịch vụ Khách hàng</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <div className="font-medium text-gray-900">Thanh toán an toàn</div>
                <div> Mastercard, VISA</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-600">
          © 2025 VietSilk Inc. All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
