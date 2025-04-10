import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const FeaturedProducts = () => {
   const [product, setProduct] = useState([]);
   const [loading,setloading]=useState(true);
   const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/product/list`)
      .then((response) => response.json())
      .then((data) => {setProduct(data),setloading(false)})
      .catch((error) => {console.error("Error fetching product items:", error),setloading(false)});
  },[]);
  // console.log(product);
    return loading ?
    (
      <div className="flex items-center justify-center  bg-gray-100 p-4">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-pink-500 mx-auto mb-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <h2 className="text-lg text-gray-600">Loading product...</h2>
        </div>
      </div>
    )
    :(
      <section className="px-10 py-8">
        <h2 className="text-3xl font-bold text-center">Trending Picks</h2>

        <div className="mt-5 w-full overflow-x-auto whitespace-nowrap px-4">
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
                  <h3 className="text-white font-bold mb-2">{product.name}</h3>{" "}
                  <button
                    className="px-4 py-2 bg-orange-500 text-white font-bold rounded"
                    onClick={() =>
                      navigate(`/product/${product.name}/${product.product_item_id}`)
                    }
                  >
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
  