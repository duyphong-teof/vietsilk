import React from 'react';

const EmptyShoppingCart = ({ onContinue }) => {
  return (
    <div className="flex justify-center items-center p-10 bg-white min-h-[300px]" data-testid="EmptyShoppingBag-component">
      <div className="text-center max-w-md p-6 border border-gray-200 rounded-lg" data-testid="pvh-empty-list">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 text-xl font-semibold text-black" data-testid="pvh-IconWithText">
            <svg
              className="w-8 h-8"
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.65072 5C7.76854 4.17776 7.95262 3.55439 8.19292 3.09564C8.40781 2.68539 8.66069 2.42048 8.94186 2.25433C9.22402 2.0876 9.56915 2 10 2C10.4309 2 10.776 2.0876 11.0581 2.25433C11.3393 2.42048 11.5922 2.68539 11.8071 3.09564C12.0474 3.55439 12.2315 4.17776 12.3493 5H7.65072ZM6.54499 6C6.5147 6.46527 6.5 6.96498 6.5 7.5H7.5C7.5 6.95197 7.51613 6.45312 7.54739 6H12.4526C12.4839 6.45312 12.5 6.95197 12.5 7.5H13.5C13.5 6.96498 13.4853 6.46527 13.455 6H16.0689L16.926 18H3.07397L3.93107 6H6.54499ZM6.64126 5C6.76935 4.02758 6.98741 3.24191 7.30708 2.63163C7.59219 2.08734 7.96431 1.67043 8.43314 1.3934C8.90098 1.11695 9.43085 1 10 1C10.5691 1 11.099 1.11695 11.5669 1.3934C12.0357 1.67043 12.4078 2.08734 12.6929 2.63163C13.0126 3.24191 13.2306 4.02758 13.3587 5H17L18 19H2L2.99995 5H6.64126Z"
                fill="black"
              />
            </svg>
            <span>Giỏ hàng của bạn đang trống</span>
          </div>
          <p className="mt-3 text-gray-600">
            Khám phá bộ sưu tập lụa Việt mới nhất – Đậm đà bản sắc dân tộc
          </p>
        </div>
        <div>
          <button
            onClick={onContinue}
            className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
            data-testid="emptyShoppingBag-pvh-button"
            type="button"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyShoppingCart;
