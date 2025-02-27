import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ShoppingCart from "./shopping_cart_item";
import Navbar from "../component/navbar";
import { FaShoppingCart } from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const location = useLocation();
  const { id } = location.state || {};

  const navigate=useNavigate();
  const getCartItems = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shopping_cart/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // console.log(data);
     const items = data.cart_product_items;
      if (response.ok) {
        setCartItems(items);
        setTotalPrice(
          items.reduce((acc, item) => acc + item.price * item.qty, 0)
        );
        return data.cart_product_items;
      }
      
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  };
  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    const items = await getCartItems(token);
    // console.log(items);
    // setCartItems(items);
    // setTotalPrice(items.reduce((acc, item) => acc + item.price * item.qty, 0));
  };
  useEffect(() => {
    fetchCartItems();
    // console.log(cartItems.length);
  }, []);
  useEffect(()=>{
    // console.log(cartItems.length);
 setTotalPrice(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  },[cartItems])

  return (
    <div>
      <Navbar user_id={id} />
      <div>
        {cartItems.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-white-100 ">
            <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />

            <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between text-lg font-medium">
                <p>Total Items:</p>
                <p>{cartItems.length}</p>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <p>Total Price:</p>
                <p>₹ {totalPrice.toFixed(2)}</p>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <p className="flex flex-col items-center justify-center col-span-full text-gray-500 py-10">
            <FaShoppingCart className="text-gray-400 text-5xl mb-3" />
            <span className="text-xl font-semibold">Your Cart is Empty</span>
            <p className="text-gray-400 mt-2">
              Add items to your cart and come back here to check out!
            </p>
            <button
              onClick={() => navigate("/product")} // Navigates to shop page
              className="mt-4 px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition"
            >
              Start Shopping
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default CartPage;
