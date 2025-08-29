import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiHeart, FiUser, FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', emailOrPhone: '', password: '', confirmPassword: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const cartItems = useSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setCurrentUser(JSON.parse(user));
  }, []);
  
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      const params = new URLSearchParams(location.search);
      params.set('q', searchTerm.trim());
      navigate(`/products?${params.toString()}`);
      setSearchTerm('');
    }
  }, [searchTerm, location.search, navigate]);
  
  const isStrongPassword = (password) => {
    let count = 0;
    if (/[A-Z]/.test(password)) count++;
    if (/[a-z]/.test(password)) count++;
    if (/[0-9]/.test(password)) count++;
    if (/[^A-Za-z0-9]/.test(password)) count++;
    return count >= 3;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isRegister && authForm.password !== authForm.confirmPassword) {
      setErrorMessage('Mật khẩu không khớp!');
      return;
    }

    if (isRegister && !isStrongPassword(authForm.password)) {
      setErrorMessage('Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
      return;
    }

    const url = isRegister
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

    const payload = isRegister
      ? {
        name: authForm.name,
        email: authForm.emailOrPhone,
        password: authForm.password
      }
      : {
        email: authForm.emailOrPhone,
        password: authForm.password
      };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Đăng nhập / đăng ký thất bại');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      setSuccessMessage(isRegister ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');

      setTimeout(() => {
        setShowAuthModal(false);
        setAuthForm({ name: '', emailOrPhone: '', password: '', confirmPassword: '' });
        setErrorMessage('');
        setSuccessMessage('');
      }, 1000);

    } catch (error) {
      console.error('Lỗi:', error);
      setErrorMessage('Lỗi kết nối server.');
    }
  };

  const navigationItems = [
    { name: 'Nữ', items: ['Mới', 'Đồ lót', 'Đồ bơi', 'Jeans', 'Quần áo'] },
    { name: 'Nam', items: ['Mới', 'Đồ lót', 'Đồ bơi', 'Jeans', 'Quần áo'] },
    { name: 'Trẻ em', items: ['Mới', 'Bé Trai', 'Bé Gái'] }
  ];

  return (
    <>
      <header className="border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 flex flex-col justify-between h-6 w-6"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="block h-0.5 bg-black rounded"></span>
              <span className="block h-0.5 bg-black rounded"></span>
              <span className="block h-0.5 bg-black rounded"></span>
            </button>

            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-bold tracking-wider">VietSilk</h1>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              {navigationItems.map(category => (
                <div
                  key={category.name}
                  className="relative"
                >
                  <button
                    onClick={() => {
                      let gioiTinh = category.name;
                      if (category.name === 'Trẻ em') gioiTinh = 'Trẻ em';
                      navigate(`/products?gioiTinh=${encodeURIComponent(gioiTinh)}`);
                    }}
                    className="flex items-center space-x-1 text-gray-900 hover:text-gray-600 py-3 px-2"
                  >
                    <span className="font-medium">{category.name}</span>
                  </button>
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-6">
              <div className="relative w-64">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="border border-gray-300 rounded-full py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black w-full"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 mt-1 mr-2 text-gray-700 hover:text-black"
                    aria-label="Tìm kiếm"
                  >
                    <FiSearch className="text-2xl" />
                  </button>
                </form>
              </div>

              <button onClick={() => navigate('/wishlist')} aria-label="Wishlist">
                <FiHeart className="text-gray-700 hover:text-red-500 text-2xl" />
              </button>

              {currentUser ? (
                <div className="flex items-center space-x-6 text-sm font-semibold text-gray-800">
                  <FiUser className="text-gray-500 mr-[-15px]" size={20} /><span className="truncate max-w-xs ">{currentUser.name}</span>

                  <button
                    onClick={() => navigate('/my-orders')}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    aria-label="Đơn hàng của tôi"
                  >
                    Đơn hàng
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem('user');
                      setCurrentUser(null);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label="Đăng xuất"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  aria-label="Đăng nhập"
                  className="text-gray-700 hover:text-black transition-colors duration-200"
                >
                  <FiUser className="text-2xl" />
                </button>
              )}


              <button className="relative" onClick={() => navigate('/cart')} aria-label="Giỏ hàng">
                <FiShoppingCart className="text-gray-700 hover:text-black text-2xl mt-1" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
              onClick={() => setShowAuthModal(false)}
              aria-label="Đóng"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h2>
            <form onSubmit={handleAuthSubmit}>
              {isRegister && (
                <>
                  <input
                    type="text"
                    placeholder="Tên"
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                    required
                    value={authForm.name}
                    onChange={(e) => {
                      setAuthForm({ ...authForm, name: e.target.value });
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Email hoặc số điện thoại"
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                    required
                    value={authForm.emailOrPhone}
                    onChange={(e) => {
                      setAuthForm({ ...authForm, emailOrPhone: e.target.value });
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full mb-1 p-2 border border-gray-300 rounded"
                    required
                    value={authForm.password}
                    onChange={(e) => {
                      setAuthForm({ ...authForm, password: e.target.value });
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  />
                  <p className="text-xs text-gray-500 mb-2">
                    Mật khẩu nên có ít nhất 3 trong 4 loại: chữ hoa, chữ thường, số, ký tự đặc biệt.
                  </p>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                    required
                    value={authForm.confirmPassword}
                    onChange={(e) => {
                      setAuthForm({ ...authForm, confirmPassword: e.target.value });
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  />
                </>
              )}

              {!isRegister && (
                <>
                  <input
                    type="text"
                    placeholder="Email hoặc số điện thoại"
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                    required
                    value={authForm.emailOrPhone}
                    onChange={(e) => {
                      setAuthForm({ ...authForm, emailOrPhone: e.target.value });
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                    required
                    value={authForm.password}
                    onChange={(e) => {
                      setAuthForm({ ...authForm, password: e.target.value });
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  />
                </>
              )}

              {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}
              {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition mb-2"
              >
                {isRegister ? 'Đăng ký' : 'Đăng nhập'}
              </button>
            </form>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 p-4 space-y-4">
          {navigationItems.map(category => (
            <button
              key={category.name}
              className="block w-full text-left text-gray-900 font-medium py-2"
              onClick={() => {
                let gioiTinh = category.name;
                if (category.name === 'Trẻ em') gioiTinh = 'Trẻ em';
                navigate(`/products?gioiTinh=${encodeURIComponent(gioiTinh)}`);
                setMobileMenuOpen(false);
              }}
            >
              {category.name}
            </button>
          ))}

          {currentUser ? (
            <div className="pt-2 border-t border-gray-200">
              <p className="font-medium mb-2">Xin chào, {currentUser.name}</p>
              <button
                className="block w-full text-left py-2 text-gray-700 hover:text-black"
                onClick={() => {
                  navigate('/orders');
                  setMobileMenuOpen(false);
                }}
              >
                Đơn hàng của tôi
              </button>
              <button
                className="block w-full text-left py-2 text-red-600 hover:text-red-800"
                onClick={() => {
                  localStorage.removeItem('user');
                  setCurrentUser(null);
                  setMobileMenuOpen(false);
                }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              className="w-full py-2 text-center text-gray-700 hover:text-black font-medium"
              onClick={() => {
                setShowAuthModal(true);
                setMobileMenuOpen(false);
              }}
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </nav>
      )}
    </>
  );
};

export default Header;
