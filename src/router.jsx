import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import Product from './user/products/products';
import Wishlist from './user/cart_and_wishlist/wishlist';
import CartPage from './user/cart_and_wishlist/cart';
import ProductDetails from './user/products/ProductDetails';
import CreateCategory from './admin/productCategory/productCategoryCreate';
import CreateProduct from './admin/product/productCreate';
import ProductItemCreate from './admin/productItem/productItemCreate';
import Logout from './pages/Logout';
// Define application routes
const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/product" element={<Product />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout/cart" element={<CartPage />} />
        <Route path="/product/:name/:id" element={<ProductDetails />} />
        {/* 
            <Route path="/admin/create-category" element={<CreateCategory/>}/>
            <Route path="/admin/create-product" element={<CreateProduct/>}/>
            <Route path="/admin/create-product-item" element={<ProductItemCreate/>}/>
             */}
      </Routes>
    );
};

export default AppRoutes;
