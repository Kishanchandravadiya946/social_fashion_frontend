import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CheckoutPopup = ({ isOpen, onClose,total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/order/create-payment-intent`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: total }),
        }
      );

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        console.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <h2 className="text-xl font-semibold text-center">
            Complete Your Payment
          </h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          >
            ✖
          </button>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <CardElement className="border border-gray-300 p-3 rounded-md" />
            <button
              type="submit"
              disabled={loading || !stripe}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default CheckoutPopup;
