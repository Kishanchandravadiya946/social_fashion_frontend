import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerifyUser from './pages/verifyUser';
import HomePage from './pages/HomePage';
import Product from './user/products/products';
import Wishlist from './user/cart_and_wishlist/wishlist';
import CartPage from './user/cart_and_wishlist/cart';
import ProceedToCheckout from './user/shop_order/ProceedToCheckout';
import OrdersList from './user/shop_order/orderList';
import ProductDetails from './user/products/ProductDetails';
import Profile from './user/component/profile/profile';
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
        <Route path="/verify" element={<VerifyUser />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/product" element={<Product />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProceedToCheckout />} />
        <Route path="/order" element={<OrdersList />} />
        <Route path="/product/:name/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        {/* 
            <Route path="/admin/create-category" element={<CreateCategory/>}/>
            <Route path="/admin/create-product" element={<CreateProduct/>}/>
            <Route path="/admin/create-product-item" element={<ProductItemCreate/>}/>
             */}
      </Routes>
    );
};

export default AppRoutes;
