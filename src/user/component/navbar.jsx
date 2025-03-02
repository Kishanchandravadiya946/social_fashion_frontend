import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import ProfileDropdown from "./profile/profiledropdown";
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const [user_id, setuserid] = useState(null);
  useEffect(() => {
    featchUserDetail();
  }, []);

  const featchUserDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        setuserid(data.user_id);
      } else {
        // console.log("ghgvh");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        SOCIAL FASHION
      </div>
      <ul className="flex gap-6">
        <li>
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-600 cursor-pointer"
          >
            Home
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/order")}
            className="hover:text-blue-600 cursor-pointer"
          >
            Shop
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/product")}
            className="hover:text-blue-600 cursor-pointer"
          >
            Product
          </button>
        </li>
      </ul>

      <div className="flex gap-4">
        {user_id && (
          <FaShoppingCart
            onClick={() => navigate("/checkout/cart")}
            className="text-xl cursor-pointer"
          />
        )}

        {user_id && (
          <button
            onClick={() => navigate("/wishlist")}
            className="border px-4 py-1 rounded-full flex items-center gap-2 hover:bg-black hover:text-white"
          >
            <FaRegHeart className="text-red-500" />
          </button>
        )}
        {user_id ? (
          <>
            <ProfileDropdown user={user_id} />
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="border px-4 py-1 rounded-full hover:bg-black hover:text-white"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
