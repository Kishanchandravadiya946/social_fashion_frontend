import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductItemCard from "./ProductItemCard"; // Import the card component

const ProductList = () => {
  const [products, setProducts] = useState([]); // Store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch product items from API
    const fetchProducts = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5050/product_item/list", {
            method: "GET",
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
      
          const data = await response.json(); // Parse the response as JSON
          setProducts(data); 
          console.log(data);
        } catch (err) {
          setError("Failed to fetch products. Please try again."); // Handle errors
        } finally {
          setLoading(false); // Stop loading
        }
      };
      

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6"> All Product</h2>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-500">Loading products...</p>}

      {/* Error State */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => <ProductItemCard key={product.SKU} product={product} />)
        ) : (
          !loading && <p className="text-center text-gray-500 col-span-full">No products available </p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
