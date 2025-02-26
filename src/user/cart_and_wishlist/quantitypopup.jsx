import React,{useEffect,useRef} from "react";
import {
  FaTimes,
  FaSmile,
  FaLaugh,
  FaGrinStars,
  FaRocket,
  FaFire,
} from "react-icons/fa"; // Icons

const QuantityPopup = ({
  selectedItem,
  selectedQty,
  setSelectedQty,
  updateQuantity,
  closePopup,
}) => {
  const qtyIcons = {
    1: <FaSmile className="text-yellow-500 text-4xl" />, // Happy Face
    2: <FaLaugh className="text-green-500 text-4xl" />, // Laughing Face
    3: <FaGrinStars className="text-blue-500 text-4xl" />, // Grinning with Stars
    4: <FaRocket className="text-purple-500 text-4xl" />, // Rocket
    5: <FaFire className="text-red-500 text-4xl" />, // Fire
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 relative flex flex-col items-center">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          onClick={closePopup}
        >
          <FaTimes size={18} />
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">
          Select Quantity for{" "}
          <span className="text-blue-600">{selectedItem.product_name}</span>
        </h3>

        <div className="mb-4">{qtyIcons[selectedQty]}</div>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((qty) => (
            <button
              key={qty}
              className={`w-12 h-12 rounded-full border-2 text-lg font-semibold
              ${
                selectedQty === qty
                  ? "bg-blue-600 text-white border-blue-600 scale-110"
                  : "bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedQty(qty)}
            >
              {qty}
            </button>
          ))}
        </div>

        <div className="flex justify-between  w-full">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={updateQuantity}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityPopup;
