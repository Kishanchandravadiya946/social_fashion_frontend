import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaHeartBroken, FaTimes } from "react-icons/fa";
import Navbar from "../component/navbar";
import { useNotification } from "../../shared/NotificationContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Wishlist = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [wishlist, setWishlist] = useState([]);
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  // Fetch Wishlist Data
  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (response.ok) {
        // console.log(data.Wishlist_product_items);
        setWishlist(data.Wishlist_product_items);
        setloading(false);
      } else {
        setloading(false);
        console.error(data.message);
      }
    } catch (error) {
      setloading(false);
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wishlist/delete/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        // Re-fetch the updated wishlist
        addNotification("Item remove from the wishlist", "success");
        // console.log(wishlist);
        setWishlist((prevItems) =>
          prevItems.filter((item) => item.wishlist_id !== itemId)
        );
        // setWishlist([]);
        // fetchWishlist();
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className=" overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg shadow-lg relative"
            >
              <button
                onClick={() => handleRemove(item.wishlist_id)}
                className="absolute top-2 right-2 bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-400 transition"
              >
                <FaTimes className="text-lg" />
              </button>
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-full h-40 object-cover rounded-md cursor-pointer"
                onClick={() =>
                  navigate(`/product/${item.product_name}/${item.id}`)
                }
              />

              <div className="mt-3">
                <h3 className="text-lg font-semibold">{item.product_name}</h3>
                <p className="text-gray-500 text-sm">
                  {item.product_description}
                </p>
                <p className="font-bold text-lg mt-2">Rs. {item.price}</p>
              </div>
            </div>
          ))
        ) : loading? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {[...Array(8)].map((_, index) => (
           <div
             key={index}
             className="border p-4 rounded-lg shadow-md animate-pulse space-y-3"
           >
             <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
             <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
             <div className="h-3 bg-gray-200 rounded w-full"></div>
             <div className="h-3 bg-gray-200 rounded w-5/6"></div>

             <div className="flex items-center justify-between mt-3">
               <div className="h-4 bg-gray-300 rounded w-1/3"></div>
               <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
             </div>
           </div>
         ))}
       </div>
        ):(
          <p className="flex flex-col items-center justify-center col-span-full text-gray-500 py-10">
            <FaHeartBroken className="text-gray-400 text-5xl mb-3" />
            <span className="text-xl font-semibold">No items in wishlist</span>
            <p className="text-gray-400 mt-2">
              Browse and add your favorite products to your wishlist.
            </p>
            <button
              onClick={() => navigate("/product")} // Navigates to shop page
              className="mt-4 px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition"
            >
              Explore Products
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
