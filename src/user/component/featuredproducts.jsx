import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
    const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5050/product/list")
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product items:", error));
  },[]);
    return (
      <section className="px-10 py-8">
        <h2 className="text-3xl font-bold text-center">Trending Picks</h2>

        <div className="w-full overflow-x-auto whitespace-nowrap px-4">
  <div className="flex space-x-4">
    {product.map((product) => (
      <div
        key={product.id}
        className="relative w-48 flex-shrink-0 rounded-lg overflow-hidden shadow-lg"
      >
        <img
          src={product.product_image}
          alt={product.name}
          className="w-full h-60 object-cover"
        />
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-center">
          <h3 className="text-white font-bold mb-2">{product.name}</h3> {/* Moved Here */}
          <button className="px-4 py-2 bg-orange-500 text-white font-bold rounded">
            Shop Now
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

      </section>
    );
  };
  
  export default FeaturedProducts;
  