import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductItemPage() {
  const [productItems, setProductItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5050/product_item/list")
      .then((response) => response.json())
      .then((data) => setProductItems(data))
      .catch((error) => console.error("Error fetching product items:", error));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      <div className="bg-opacity-20 bg-gray-100 p-8 rounded-xl shadow-lg w-3/4">
        <h2 className="text-2xl font-bold text-white text-center mb-4">PRODUCT ITEMS</h2>

        <div className="flex justify-between mb-4">
          <button
            className="bg-green-400 text-black font-semibold py-2 px-4 rounded-full hover:bg-green-500"
            onClick={() => navigate("/admin/create-product-item")}
          >
            +Create Product Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productItems.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg">
          <img
            src={item.product_image || "https://via.placeholder.com/150"}
            alt={item.SKU}
            className="w-full h-48 object-cover rounded-md"
          />
          <h3 className="text-xl font-bold mt-2">SKU: {item.SKU}</h3>
          <p className="text-gray-600">Stock: {item.qty_in_stock}</p>
          <p className="text-gray-800 font-semibold">Price: ${item.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
      </div>
    </div>
  );
}
