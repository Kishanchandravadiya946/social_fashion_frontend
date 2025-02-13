import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import CreateCategory from './admin/productCategory/productCategoryCreate';
import CreateProduct from './admin/product/productCreate';
import ProductItemCreate from './admin/productItem/productItemCreate';

// Define application routes
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin/create-category" element={<CreateCategory/>}/>
            <Route path="/admin/create-product" element={<CreateProduct/>}/>
            <Route path="/admin/create-product-item" element={<ProductItemCreate/>}/>
        </Routes>
    );
};

export default AppRoutes;
