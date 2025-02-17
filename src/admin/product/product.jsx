import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/product/list");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8">
  {/* Header Section */}
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold text-gray-800">Product List</h2>
    <button
      onClick={() => navigate("/admin/create-product")}
      className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"

    >
      + Create New Product
    </button>
  </div>

  {/* Product Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      >
        <img
          src={product.product_image || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
        <h3 className="text-xl font-bold mt-3 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
          View Details
        </button>
      </div>
    ))}
  </div>

  {/* No Products Message */}
  {products.length === 0 && (
    <p className="text-center text-gray-800 text-lg mt-10">No products available.</p>
  )}
</div>
  );
}
