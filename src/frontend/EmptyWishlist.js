import React from 'react';

const EmptyWishlist = ({ onContinue }) => {
  return (
    <div className="flex justify-center items-center p-10 bg-white min-h-[300px]" data-testid="EmptyWishlist-component">
      <div className="text-center max-w-md p-6 border border-gray-200 rounded-lg" data-testid="empty-wishlist-box">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 text-xl font-semibold text-black" data-testid="empty-wishlist-icon-text">
            <span>Danh sách yêu thích trống</span>
          </div>
          <p className="mt-3 text-gray-600">
            Hãy khám phá và thêm những sản phẩm bạn yêu thích nhất!
          </p>
        </div>
        <div>
          <button
            onClick={onContinue}
            className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
            data-testid="empty-wishlist-button"
            type="button"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyWishlist;
