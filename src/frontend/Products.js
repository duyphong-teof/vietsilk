import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const gioiTinh = searchParams.get('gioiTinh') || '';
  const q = searchParams.get('q') || ''; 

  const [searchQuery, setSearchQuery] = useState(q);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgIndexes, setImgIndexes] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5000/api/products?gioiTinh=${gioiTinh}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);

        const initialIndexes = {};
        data.forEach((p) => {
          initialIndexes[p._id] = 0;
        });
        setImgIndexes(initialIndexes);
      } catch (error) {
        console.error('Fetch products error:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [gioiTinh, q]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (gioiTinh) params.gioiTinh = gioiTinh;
    if (searchQuery.trim()) params.q = searchQuery.trim();
    setSearchParams(params);
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-light mb-3">
          {q
            ? `Kết quả tìm kiếm: "${q}"`
            : gioiTinh
            ? `${gioiTinh.charAt(0).toUpperCase() + gioiTinh.slice(1).toLowerCase()}`
            : 'Tất cả sản phẩm'}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {products.map((product) => {
              const images = product.hinhAnh?.[0]
                ? product.hinhAnh[0].split(',').map((img) => img.trim()).filter(Boolean)
                : [];
              const currentIndex = imgIndexes[product._id] ?? 0;
              const currentImage = images.length > 0 ? images[currentIndex] : null;
              const gender = product.gioiTinh?.toLowerCase();
              const folder = gender === 'nữ' ? 'Women' : 'Men';

              return (
                <div key={product._id} className="cursor-pointer group relative">
                  <div className="overflow-hidden rounded-md border border-gray-200 group-hover:shadow-lg transition-shadow duration-300 relative">
                    {currentImage ? (
                      <img
                        src={`/images/${folder}/${currentImage}`}
                        alt={product.tenSanPham}
                        className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                        onError={(e) => (e.currentTarget.src = '/images/default-image.jpg')}
                      />
                    ) : (
                      <img
                        src="/images/default-image.jpg"
                        alt="default"
                        className="w-full h-[300px] object-cover"
                      />
                    )}

                    {images.length > 1 && (
                      <>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setImgIndexes((prev) => {
                              let newIndex = (prev[product._id] - 1 + images.length) % images.length;
                              return { ...prev, [product._id]: newIndex };
                            });
                          }}
                          className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer text-black text-xl bg-transparent rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          role="button"
                          aria-label="Previous image"
                        >
                          ‹
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setImgIndexes((prev) => {
                              let newIndex = (prev[product._id] + 1) % images.length;
                              return { ...prev, [product._id]: newIndex };
                            });
                          }}
                          className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-black text-xl bg-transparent rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          role="button"
                          aria-label="Next image"
                        >
                          ›
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-gray-900">{product.tenSanPham}</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    {product.gia.toLocaleString('vi-VN')} VND
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
          <Footer />
    </>
  );
};

export default Products;
