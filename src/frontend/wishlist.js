import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import EmptyWishlist from './EmptyWishlist'; // Đây là component bạn dùng để hiển thị khi trống

const WishlistPage = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách id yêu thích từ localStorage khi component mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavoriteIds(favorites);
  }, []);

  // Khi favoriteIds thay đổi, gọi API để lấy thông tin sản phẩm
  useEffect(() => {
    if (favoriteIds.length === 0) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Giả sử API hỗ trợ lấy nhiều sản phẩm theo danh sách id (nếu không, bạn có thể lặp fetch từng sản phẩm)
        const responses = await Promise.all(
          favoriteIds.map(id => fetch(`http://localhost:5000/api/products/${id}`))
        );
        const products = await Promise.all(responses.map(res => res.json()));
        setFavoriteProducts(products);
      } catch (error) {
        console.error('Failed to fetch favorite products:', error);
        setFavoriteProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [favoriteIds]);

  const handleRemove = (id) => {
    const updatedFavorites = favoriteIds.filter(favId => favId !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavoriteIds(updatedFavorites);
  };

  const handleContinueShopping = () => {
    window.location.href = '/products';
  };

  if (loading) {
    return (
      <>
        <Header />
        <p className="text-center my-20 text-gray-500">Đang tải...</p>
        <Footer />
      </>
    );
  }

  return (
    <div className="pb-10">
      <Header />

      {favoriteProducts.length === 0 ? (
        <EmptyWishlist onContinue={handleContinueShopping} />
      ) : (
        <div className="max-w-5xl mx-auto px-8 py-12">
             <h1 className="text-2xl font-bold mb-6">Danh sách yêu thích</h1>
          {favoriteProducts.map(product => (
            <div
              key={product._id || product.id}
              className="flex items-center justify-between border-b border-gray-300 py-4 space-x-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`/images/${product.gioiTinh === 'Nữ' ? 'Women' : 'Men'}/${product.hinhAnh[0].split(',')[0].trim()}`}
                  alt={product.tenSanPham}
                  className="w-20 h-20 object-cover rounded"
                  onError={e => (e.currentTarget.src = '/images/default-image.jpg')}
                />
                <div>
                  <p className="font-semibold">{product.tenSanPham}</p>
                  <p className="text-gray-600">{product.gia.toLocaleString('vi-VN')} VND</p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={() => handleRemove(product._id || product.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default WishlistPage;
