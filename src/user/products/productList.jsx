import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductList = ({ selectedCategory, selectedCategories }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

      const fetchProducts = async () => {
        try {
          const token = localStorage.getItem("token");

          const headers = token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {
              };
          const response = await fetch(
            `http://127.0.0.1:5050/product_item/category/${selectedCategory}`,
            {
              method: "GET",
              headers: headers,
            }
          );
          if (!response.ok) throw new Error("Failed to fetch products");
          const data = await response.json();
          // console.log(data);
          setProducts(data.product_items);
        } catch (error) {
          setProducts([]);
          console.error("Error fetching products:", error);
        }
      };
  useEffect(() => {
    if (!selectedCategory) return; 
    fetchProducts();
  }, [selectedCategory]);

  const addToWishlist = async (productItemId) => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      console.error("User is not authenticated");
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5050/wishlist/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_item_id: productItemId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Item added to wishlist:", data);
        setProducts([]);
        fetchProducts();
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="w-3/4 p-4">
      <h2 className="text-lg font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.SKU} className="border p-4 rounded shadow-md">
            <img
              src={product.product_image}
              alt={product.SKU}
              className="w-full h-60 object-cover rounded"
            />
            <h3 className="font-semibold text-lg mt-2">
              {product.product.name}
            </h3>

            <p className="text-gray-500 text-sm">
              {product.product.description}
            </p>

            <div className="flex items-center justify-between mb-2 mt-2">
              <p className="text-lg font-bold text-black">
                Rs. {product.price}
              </p>
              {product.wishlist !== undefined && (
                <button
                  className="text-gray-600 text-2xl p-2 rounded-full transition-colors duration-200 hover:text-red-500"
                  onClick={() =>
                    product.wishlist ? null : addToWishlist(product.id)
                  }
                >
                  {product.wishlist ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-600" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
