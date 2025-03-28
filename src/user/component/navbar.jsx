import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import ProfileDropdown from "./profile/profiledropdown";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const [user_id, setuserid] = useState(null);
  useEffect(() => {
    featchUserDetail();
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/order" },
    { name: "Product", path: "/product" },
  ];
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
    <nav className="flex justify-between items-center p-4 bg-white shadow-md relative">
      {/* Logo */}
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        SOCIAL FASHION
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-6">
        {navLinks.map((link) => (
          <li key={link.path}>
            <button
              onClick={() => navigate(link.path)}
              className="hover:text-blue-600 cursor-pointer"
            >
              {link.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Right Side (Cart, Wishlist, Profile, Login) */}
      <div className="hidden md:flex gap-4">
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
          <ProfileDropdown user={user_id} mobile={0} />
        ) : (
          // <FaBars/>
          <button
            onClick={() => navigate("/login")}
            className="border px-4 py-1 rounded-full hover:bg-black hover:text-white"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <>
          <motion.ul
            initial={{ opacity: 0, height: 0, width: "100%" }}
            animate={{ opacity: 1, height: "auto", width: "100%" }}
            exit={{ opacity: 0, height: 0, width: 0 }}
            transition={{
              duration: 0.7 / 2,
              ease: "easeInOut",
              staggerChildren: 0.2 / 2, // Ensures children appear one by one
              staggerDirection: -1,
            }}
            className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50 overflow-hidden"
          >
            {navLinks.map((link, index) => (
              <motion.li
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: (index * 0.1) / 2, duration: 0.5 }}
              >
                <button
                  onClick={() => {
                    navigate(link.path);
                    setMenuOpen(false);
                  }}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  {link.name}
                </button>
              </motion.li>
            ))}

            {user_id && (
              <motion.li
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2 / 2, duration: 0.5 }}
              >
                <FaShoppingCart
                  onClick={() => {
                    navigate("/checkout/cart");
                    setMenuOpen(false);
                  }}
                  className="text-xl cursor-pointer"
                />
              </motion.li>
            )}
            {user_id && (
              <motion.li
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.3 / 2, duration: 0.5 }}
              >
                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setMenuOpen(false);
                  }}
                  className="border px-4 py-1 rounded-full flex items-center gap-2 hover:bg-black hover:text-white"
                >
                  <FaRegHeart className="text-red-500" />
                </button>
              </motion.li>
            )}
            {user_id ? (
              <AnimatePresence>
                <ProfileDropdown user={user_id} mobile={1} />
              </AnimatePresence>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="border px-4 py-1 rounded-full hover:bg-black hover:text-white"
              >
                Login
              </button>
            )}
          </motion.ul>
        </>
      )}
    </nav>
  );
};

export default Navbar;
