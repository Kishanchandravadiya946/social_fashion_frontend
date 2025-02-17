import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateProductModal from "./productCreate";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex flex-col  min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-8">
       <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-green-400 text-black font-semibold py-3 px-6 rounded-full hover:bg-green-500"
      >
        + Create New Product
      </button>
      {isModalOpen && <CreateProductModal onClose={() => setIsModalOpen(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg">
            <img src={product.product_image || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-48 object-cover rounded-md" />
            <h3 className="text-xl font-bold mt-2">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
