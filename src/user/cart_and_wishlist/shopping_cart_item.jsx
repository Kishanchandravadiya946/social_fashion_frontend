import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuantityPopup from "./quantitypopup";
import { addToCart } from "../sharedCart/shopping_cart";
import { FaTimes } from "react-icons/fa";
import { useNotification } from "../../shared/NotificationContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ShoppingCart = ({ cartItems, setCartItems }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const { addNotification } = useNotification();
  // console.log(cartItems);
  const navigate = useNavigate();

  const openPopup = (item) => {
    setSelectedItem(item);
    setSelectedQty(item.qty);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("User is not authenticated");
    return { error: "User is not authenticated" };
  }
  const deleteItem = async (cartItemId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping_cart/remove/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      //  console.log(data);
      if (response.ok) {
        // console.log("ggg");
        addNotification("Item remove from the cart", "success");
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cart_item_id !== cartItemId)
        );
      }
    } catch (error) {
      console.error("Error removing item:", error);
      return { success: false };
    }
  };
  const updateQuantity = async () => {
    if (selectedItem) {
      const result = await addToCart(selectedItem.id, selectedQty);
      if (result.success) {
        // console.log(cartItems);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cart_item_id === selectedItem.cart_item_id
              ? { ...item, qty: selectedQty }
              : item
          )
        );
        closePopup();
      }
    }
  };
  return (
    <div className="h-screen overflow-y-auto w-full md:w-2/3 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      {!cartItems?.length ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div
            key={item.cart_item_id}
            className="relative flex items-center justify-between border-b p-4"
          >
            <button
              onClick={() => deleteItem(item.cart_item_id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>
            <img
              src={item.product_image}
              alt={item.product_name}
              className="w-16 h-16 object-cover rounded cursor-pointer"
              onClick={() =>
                navigate(`/product/${item.product_name}/${item.id}`)
              }
            />
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold">{item.product_name}</h3>
              <p className="text-sm text-gray-500">
                {item.product_description}
              </p>
              <p
                onClick={() => openPopup(item)}
                className="text-md font-medium cursor-pointer"
              >
                Qty: {item.qty}
              </p>
              <p className="text-red-500 font">₹ {item.price}</p>
            </div>
            <p className="text-lg font-bold">₹ {item.price * item.qty}</p>

            {showPopup && selectedItem && (
              <QuantityPopup
                selectedItem={selectedItem}
                selectedQty={selectedQty}
                setSelectedQty={setSelectedQty}
                updateQuantity={updateQuantity}
                closePopup={closePopup}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ShoppingCart;
