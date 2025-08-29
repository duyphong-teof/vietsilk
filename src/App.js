import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VietSilkApp from './frontend/Home.js';
import Products from './frontend/Products.js';
import CartPage from './frontend/cartPage.js';
import Wishlist from './frontend/wishlist.js';
import ProductDetail from './frontend/ProductDetail.js';
import OrderSuccess from './frontend/OrderSuccess.js';
import MyOrders from './frontend/MyOrders.js';
function App() {
  return (
    <Routes>
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/" element={<VietSilkApp />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}

export default App;
