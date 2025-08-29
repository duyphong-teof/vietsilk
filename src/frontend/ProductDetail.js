import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { addItem } from './redux/shopping_cart';
import { FiHeart } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.kichThuoc) {
      const sizes = product.kichThuoc.split(',').map(s => s.trim());
      setSelectedSize(sizes[0]);
    } else {
      setSelectedSize('S');
    }
  }, [product]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(id));
  }, [id]);


  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let updatedFavorites;

    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
      setIsFavorite(false);
    } else {
      updatedFavorites = [...favorites, id];
      setIsFavorite(true);
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (loading || !product) {
    return (
      <>
        <Header />
        <p className="text-center my-20 text-gray-500">Loading...</p>
        <Footer />
      </>
    );
  }

  const sizeOptions = product?.kichThuoc
    ? product.kichThuoc.split(',').map(s => s.trim())
    : ['S', 'M', 'L', 'XL'];

  const images = product.hinhAnh[0]
    .split(',')
    .map(i => i.trim())
    .filter(Boolean);

  const handleAddToCart = () => {
    const basePath = `/images/${product.gioiTinh === 'Nữ' ? 'Women' : 'Men'}/`;
    const itemToAdd = {
      id: product._id || product.id,
      name: product.tenSanPham,
      price: product.gia,
      quantity: 1,
      size: selectedSize,
      color: product.mauSac || '',
      image: basePath + images[imgIndex],
    };

    dispatch(addItem(itemToAdd));
    navigate('/cart');
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-8 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={`/images/${product.gioiTinh === 'Nữ' ? 'Women' : 'Men'}/${images[imgIndex]}`}
            alt={product.tenSanPham}
            className="w-full h-[450px] object-contain rounded -ml-20 bg-white"
            onError={e => (e.currentTarget.src = '/images/default-image.jpg')}
          />
          <div className="flex space-x-2 mt-4">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`/images/${product.gioiTinh === 'Nữ' ? 'Women' : 'Men'}/${img}`}
                alt={`thumb-${idx}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer ${idx === imgIndex ? 'border-2 border-black' : ''}`}
                onClick={() => setImgIndex(idx)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">{product.tenSanPham}</h2>
          <p className="text-2xl text-gray-800 mb-6">
            {product.gia.toLocaleString('vi-VN')} VND
          </p>
          <p className="inline-block text-black font-normal text-[14px] leading-[21px] mb-[7px] mr-[7px]">
  Màu sắc: {product.mauSac || 'Không xác định'}
</p>


          <div className="mb-6">
            <p className="inline-block text-black font-normal text-[19px] leading-[21px] mb-[7px] mr-[7px]">
            Chọn kích cỡ:
            </p>

            <div className="flex gap-2 flex-wrap">
              {sizeOptions.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border-[1.5px] rounded cursor-pointer ${
  selectedSize === size
    ? 'border-black text-black bg-white font-semibold'
    : 'border-gray-300 text-gray-700 hover:border-black bg-white'
}`}

                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-gray-700 mt-3 text-sm">Kích cỡ: {selectedSize}</p>
          </div>

          <div className="mb-6">
            <button
              className="text-blue-600 font-medium hover:underline mb-2"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Ẩn thông tin sản phẩm ▲' : 'Xem thông tin sản phẩm ▼'}
            </button>

            {showDetails && (
              <p className="text-gray-700 leading-relaxed mt-2">{product.moTa}</p>
            )}
          </div>

          <div className="flex items-center gap-4">


            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-4 py-3 rounded border font-medium transition ${isFavorite
                ? 'text-red-600 border-red-300 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 border-gray-300 hover:border-black'
                }`}
            >
              <FiHeart className={`text-xl ${isFavorite ? 'text-red-600' : ''}`} />

            </button>
            <button
              className="bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
