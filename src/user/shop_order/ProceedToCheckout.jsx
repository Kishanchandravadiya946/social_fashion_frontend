import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Navbar from "../component/navbar";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProceedToCheckout = () => {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [defaultAddress, setdefaultaddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [ShippingMethod, setShippingMethod] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("User is not authenticated");
    navigate("/login");
  }
  useEffect(() => {
    fetchShippingAddresses();
    // fetchPaymentMethods();
    fetchShippingMethods();
    calculateTotal();
  }, [cartItems]);

  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId);
  };

  const fetchShippingAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/addresslist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setShippingAddresses(data.address_list);
      setdefaultaddress(data.is_default);
      // console.log(data);
      setSelectedAddress(data.is_default);
    } catch (error) {
      console.error("Error fetching shipping addresses:", error);
    }
  };
  const fetchShippingMethods = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/order/shipping_method/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch shipping methods");
      }
      const data = await response.json();
      // console.log(data, data[0].id);
      setShippingMethod(data);
      setSelectedShippingMethod(data[0].id);
      // console.log(selectedShippingMethod);
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/payment_methods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPaymentMethods(data);
      if (data.length > 0) setSelectedPaymentMethod(data[0].id);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const calculateTotal = () => {
    let total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    const selectedMethod = ShippingMethod.find(
      (method) => method.id == selectedShippingMethod
    );
   if(selectedMethod){
    total += selectedMethod.price;}

    setTotalPrice(total);
  };
      useEffect(() => {
    calculateTotal();
  }, [selectedShippingMethod]);

  const handleCheckout = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      alert("Please select a shipping address and payment method.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/checkout/place_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipping_address: selectedAddress,
          payment_method_id: selectedPaymentMethod,
          items: cartItems.map((item) => ({
            product_item_id: item.id,
            qty: item.qty,
            price: item.price,
          })),
          order_total: totalPrice,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        navigate("/order-confirmation");
      } else {
        alert("Error placing order: " + data.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // console.log("aaa",setSelectedShippingMethod);
  return (
    <div>
      <Navbar />

      <div className="w-full max-w-3xl  p-8 bg-white rounded-lg shadow-lg mt-10 mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Proceed to Checkout
        </h2>

        {/* Shipping Address Section */}
        <div className="space-y-2">
          <h3 className="mt-2 text-lg font-semibold mb-4">
            Select Shipping Address
          </h3>
          {shippingAddresses && shippingAddresses.length > 0 ? (
            shippingAddresses.map((address) => (
              <div
                key={address.id}
                className={`relative border p-3 rounded-lg shadow-sm flex justify-between items-center cursor-pointer transition-all duration-300
                   ${
                     selectedAddress === address.id
                       ? "border-green-500 bg-green-50"
                       : "border-gray-300"
                   }`}
                onClick={() => handleSelectAddress(address.id)}
              >
                {/* Address Details (Left Side) */}
                <div className="flex-1">
                  <div className="text-gray-900 font-medium">
                    <p>
                      {address.unit_number} {address.street_number}
                    </p>
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                      {address.city}, {address.region}, {address.postal_code}
                    </p>
                    <p>{address.country_name}</p>
                  </div>
                </div>

                {/* Default Badge */}
                {defaultAddress === address.id && (
                  <span className="text-sm text-green-600 font-semibold px-2 py-1 bg-green-100 rounded-lg">
                    Default
                  </span>
                )}

                {/* Selection Checkmark (Top Right) */}
                {selectedAddress === address.id && (
                  <FaCheckCircle className="absolute top-2 right-2 text-green-500 text-xl" />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No addresses available. Please add an address.
            </p>
          )}
        </div>
        <br />
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Shipping Method</h3>
          <select
            className="w-full p-2 border rounded"
            value={selectedShippingMethod}
            onChange={(e) => {
              setSelectedShippingMethod(e.target.value);
            }}
          >
            {ShippingMethod.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name} - ₹{method.price}
              </option>
            ))}
          </select>
        </div>
        <br />
        {/* Order Summary Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b py-2">
                <p className="text-gray-800">
                  {item.product_name} (Qty: {item.qty})
                </p>
                <p className="text-gray-900 font-semibold">
                  ₹ {item.price * item.qty}
                </p>
              </div>
            ))}
            <p className="text-xl font-bold mt-2 text-right">
              {/* {ShippingMethod.filter(
                (method) => method.id == selectedShippingMethod
              ).map((method) => (
                <p key={method.id}>
                  {method.name} - ₹{method.price}
                </p>
              ))} */}
            </p>
            <p className="text-xl font-bold mt-2 text-right">
              Total: ₹ {totalPrice}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Select Payment Method</h3>
          <select
            className="w-full p-3 border rounded mt-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.provider} - {method.account_number}
              </option>
            ))}
          </select>
        </div>
        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default ProceedToCheckout;
