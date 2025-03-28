import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateProductModal from "./productCreate";
import ProductUpdateModal from "./productUpdate";
import ProductDeleteModal from "./productDelete"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
 
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/list`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      
      setProducts(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    console.log(product)
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex flex-col  min-h-screen bg-gradient-to-b  p-8 relative">
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mb-6 bg-green-400 text-black font-semibold py-3 px-6 rounded-full hover:bg-green-500"
      >
        + Create New Product
      </button>
      {isCreateModalOpen && (
        <CreateProductModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-lg relative"
          >
            <img
              src={product.product_image || "https://via.placeholder.com/150"}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-xl text-black font-bold mt-2">
              {product.name}
            </h3>
            <p className="text-gray-600">{product.description}</p>
            <button
              onClick={() => {
                handleEditClick(product);
              }}
              className="mt-3 mb-3 absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(product)}
              className="bg-red-500 text-white px-4 py-2 mt-3 mb-3 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <ProductUpdateModal
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchProducts}
        />
      )}

      {isDeleteModalOpen && (
        <ProductDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          product={selectedProduct}
          onDelete={fetchProducts}
        />
      )}
    </div>
  );
}