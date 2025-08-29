import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from './ChatBot';
const VietSilkApp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ setImgIndexes] = useState({});

  const fetchProducts = async (gioiTinh) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products?gioiTinh=${gioiTinh}`);
      const data = await response.json();
      setProducts(data);
      const initialIndexes = {};
      data.forEach((p) => {
        initialIndexes[p._id] = 0;
      });
      setImgIndexes(initialIndexes);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts('Nam');
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert('Cảm ơn bạn đã đăng ký nhận tin');
      setEmail('');
    }
  };

  const getImagesArray = (hinhAnh) => {
    if (!hinhAnh) return [];
    if (Array.isArray(hinhAnh)) {
      return hinhAnh.flatMap((item) =>
        typeof item === 'string' ? item.split(',').map((img) => img.trim()) : []
      );
    }
    if (typeof hinhAnh === 'string') {
      return hinhAnh.split(',').map((img) => img.trim());
    }
    return [];
  };

  const changeImageIndex = (productId, direction) => {
    setImgIndexes((prev) => {
      const product = products.find((p) => p._id === productId);
      const images = getImagesArray(product.hinhAnh);
      if (images.length === 0) return prev;

      let newIndex = prev[productId] ?? 0;
      if (direction === 'next') {
        newIndex = (newIndex + 1) % images.length;
      } else if (direction === 'prev') {
        newIndex = (newIndex - 1 + images.length) % images.length;
      }

      return { ...prev, [productId]: newIndex };
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section
        className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/images/bg.webp')" }}
      >
        <div className="text-center bg-white/70 p-6 rounded shadow-lg max-w-2xl w-full mx-4">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Thời trang VietSilk
          </h2>
          <p className="text-lg text-gray font-medium mb-7">
            Khám phá bộ sưu tập mới nhất của Viet Silks – Đậm đà bản sắc Việt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products?gioiTinh=Nữ')}
              className="bg-white text-black px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors"
            >
              Nữ
            </button>
            <button
              onClick={() => navigate('/products?gioiTinh=Nam')}
              className="bg-white text-black px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors"
            >
              Nam
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sản phẩm nổi bật</h2>
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => {
              const images = getImagesArray(product.hinhAnh);
              const currentImage = images.length > 0 ? images[0] : null;
              const gender = product.gioiTinh?.toLowerCase();
              const folder = gender === 'nữ' || gender === 'nu' ? 'Women' : 'Men';
              const imageUrl = currentImage ? `/images/${folder}/${currentImage}` : '/images/default-image.jpg';

              return (
                <div key={product._id} className="cursor-pointer group relative">
                  <div className="overflow-hidden rounded-md border border-gray-200 group-hover:shadow-lg transition-shadow duration-300 relative">
                    <img
                      src={imageUrl}
                      alt={product.tenSanPham}
                      className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                      onError={(e) => (e.currentTarget.src = '/images/default-image.jpg')}
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-gray-900 text-center">{product.tenSanPham}</h3>
                  <p className="text-sm text-gray-700 mt-1 text-center">{product.gia.toLocaleString('vi-VN')} VND</p>
                </div>
              );
            })}

          </div>
        )}
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h5 className='text-2xl font-semibold mb-6'>Đăng ký mail nhận ưu đãi từ VietSilk</h5>
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default VietSilkApp;
