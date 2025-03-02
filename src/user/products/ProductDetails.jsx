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
  const { addNotification } = useNotification();
  useEffect(() => {
    if (!product_item) {
      fetchProductDetails();
    }
  }, [product_item]);

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};
      const response = await fetch(`${API_BASE_URL}/product_item/${id}`, {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) {
        setProductItem(null);
        throw new Error("Failed to fetch product  item");
      }
      const data = await response.json();
      //  console.log(data);
      setProductItem(data.product_item);
    } catch (error) {
      // console.log("hh");
      setProductItem(null);
      //  console.log(product_item);
      console.error("Error fetching products:", error);
    }
  };

  const addToWishlist = async (productItemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
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
        // console.log("Item added to wishlist:", data);
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
      // alert("Item added to cart!");
      addNotification("Item added to cart", "success");
    } else {
      addNotification("Login required", "error");
      // alert(result.error);
    }
  };

  if (!product_item) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <FaBoxOpen className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">
              Product Item Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The product item you are looking for does not exist or has been
              removed.
            </p>
            <button
              onClick={() => navigate("/")} // Navigates back to homepage
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
      <div className="w-full h-screen p-8 md:p-16 bg-white-50 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Product Image */}
          <div className="flex justify-center">
            <img
              src={product_item.product_image}
              alt={product_item.SKU}
              className="w-[90%] max-w-xl h-auto object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Right Side: Product Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              {product_item.product?.name}
            </h1>
            <p className="text-gray-600 text-lg">
              {product_item.product?.description}
            </p>

            <p className="text-2xl font-semibold">
              <span className="text-gray-700">Price:</span>
              <span className="text-black"> Rs. {product_item.price}</span>
            </p>

            <p className="text-lg text-gray-700">
              <span className="font-semibold">Stock:</span>{" "}
              {product_item.qty_in_stock} available
            </p>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center space-x-2 bg-pink-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-pink-600 transition"
              >
                <FaShoppingBag />
                <span>ADD TO BAG</span>
              </button>

              <button
                className={`flex items-center space-x-2 border border-gray-300 font-semibold px-6 py-3 rounded-lg shadow-md transition 
                ${
                  product_item.wishlist
                    ? "bg-gray-200 text-gray-500"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => {
                  if (!product_item.wishlist) {
                    addToWishlist(product_item.id);
                  }
                }}
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
