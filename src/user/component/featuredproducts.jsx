import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
    const products = [
      { id: 1, name: "Classic Blazer", price: "$89", image: "https://via.placeholder.com/200" },
      { id: 2, name: "Trendy Coat", price: "$120", image: "https://via.placeholder.com/200" },
      { id: 3, name: "Casual Shirt", price: "$45", image: "https://via.placeholder.com/200" },
    ];
    const [productItems, setProductItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5050/product_item/list")
      .then((response) => response.json())
      .then((data) => setProductItems(data))
      .catch((error) => console.error("Error fetching product items:", error));
  }, []);
  
    return (
      <section className="px-10 py-8">
        <h2 className="text-3xl font-bold text-center">Trending Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productItems.slice(0,3).map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg">
          <img
            src={item.product_image || "https://via.placeholder.com/150"}
            alt={item.SKU}
            className="w-full h-48 object-cover rounded-md"
          />        
          <p className="text-gray-800 font-semibold">Price: ${item.price.toFixed(2)}</p>
          <p className="text-gray-600">Stock: {item.qty_in_stock}</p>
        </div>
      ))}
    </div>
      </section>
    );
  };
  
  export default FeaturedProducts;
  