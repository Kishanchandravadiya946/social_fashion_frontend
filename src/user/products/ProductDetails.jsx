import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../component/navbar";
import { FaRegHeart, FaHeart, FaShoppingBag, FaBoxOpen } from "react-icons/fa";
import { addToCart } from "../shared/shopping_Cart";
import { useNotification } from "../../shared/NotificationContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, product: initialProduct } = location.state || {};
  const [product_item, setProductItem] = useState(initialProduct || null);
  const [loading, setloading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
      fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`${API_BASE_URL}/product_item/${id}`, {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) {
        setProductItem(null);
        throw new Error("Failed to fetch product item");
      }
      const data = await response.json();
      setProductItem(data.product_item);
      setloading(false);
    } catch (error) {
      setProductItem(null);
      setloading(false);
      console.error("Error fetching product:", error);
    }
  };

  const addToWishlist = async (productItemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      addNotification("Login required", "error");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_item_id: productItemId }),
      });
      const data = await response.json();
      if (response.ok) {
        addNotification("Item added to wishlist", "success");
        setProductItem((prev) => ({ ...prev, wishlist: true }));
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product_item.id);
    if (result.success) {
      addNotification("Item added to cart", "success");
    } else {
      addNotification("Login required", "error");
    }
  };
if (loading) {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
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
    </div>
  );
}

  if (!loading &&!product_item) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="text-center">
            <FaBoxOpen className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">
              Product Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The product does not exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center">
            <img
              src={product_item.product_image}
              alt={product_item.SKU}
              className="w-80 h-80 object-cover rounded-xl shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product_item.product?.name}
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              {product_item.product?.description}
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              Rs. {product_item.price}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Stock:</span>{" "}
              {product_item.qty_in_stock} available
            </p>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center space-x-2 bg-pink-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-pink-600 transition w-full md:w-auto"
              >
                <FaShoppingBag />
                <span>ADD TO BAG</span>
              </button>

              <button
                className={`flex items-center justify-center space-x-2 border border-gray-300 font-semibold px-6 py-3 rounded-lg shadow-md transition w-full md:w-auto
                  ${
                    product_item.wishlist
                      ? "bg-gray-200 text-gray-500"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                onClick={() =>
                  !product_item.wishlist && addToWishlist(product_item.id)
                }
                disabled={product_item.wishlist}
              >
                {product_item.wishlist ? (
                  <>
                    <FaHeart className="text-red-500" />
                    <span>IN WISHLIST</span>
                  </>
                ) : (
                  <>
                    <FaRegHeart />
                    <span>ADD TO WISHLIST</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
