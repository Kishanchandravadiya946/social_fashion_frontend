import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeart ,FaTimes} from "react-icons/fa";
import Navbar from "../component/navbar";

const Wishlist = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Fetch Wishlist Data
  const fetchWishlist = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5050/wishlist/all", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (response.ok) {
        // console.log(data.Wishlist_product_items);
        setWishlist(data.Wishlist_product_items);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove Wishlist Item
  const handleRemove = async (itemId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5050/wishlist/delete/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        // Re-fetch the updated wishlist
        setWishlist([]);
        fetchWishlist();
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
      <Navbar user_id={id} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
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
                className="w-full h-40 object-cover rounded-md"
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
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No items in wishlist
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
