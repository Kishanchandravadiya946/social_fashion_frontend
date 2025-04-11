import { useEffect, useState } from "react";
import Navbar from "../component/navbar";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/order/shop`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
        if (response.status == 404) {
        }
        // console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="text-center text-lg font-semibold">Loading orders...</div>
    );
  if (error)
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center col-span-full py-20 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h18l-1 13H4L3 3zm4 16h10a1 1 0 001-1v-1H6v1a1 1 0 001 1z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-600">No Orders Yet</h2>
          <p className="text-gray-400 mt-2">
            It looks like you haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/product")} // Navigates to shop page
            className="mt-4 px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition"
          >
            Start shopping
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white p-5 shadow-md rounded-lg border"
              >
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                  <h3 className="text-lg font-semibold">
                    Order Status : {order.order_status}
                  </h3>
                  <p className="text-gray-600 text-sm">{order.order_date}</p>
                </div>

                {/* <p className="text-gray-700">
                  <strong>Shipping Address:</strong> {order.shipping_address}
                </p> */}
                <p className="text-red-500">
                  <strong>Order Total:</strong> ₹ {order.order_total.toFixed(2)}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold text-lg">Items:</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex items-center gap-4 p-3 border rounded-md"
                      >
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-md cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/product/${item.product_name}/${item.product_id}`
                            )
                          }
                        />
                        <div>
                          <h5 className="font-medium">{item.product_name}</h5>
                          <p className="text-gray-600">Qty: {item.qty}</p>
                          <p className="text-gray-700 font-semibold">
                            ₹ {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
