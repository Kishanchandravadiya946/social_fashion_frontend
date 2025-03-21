import { useEffect, useState } from "react";
import { PackageCheck, Pencil } from "lucide-react";
import EditStatusModal from "./orderstatusedit";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/order/allorders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        console.error("Error fetching orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatusId, newStatusName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/order/changestatus`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: orderId, status_id: newStatusId }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? { ...order, order_status: newStatusName, order_status_id: newStatusId }
              : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <PackageCheck className="mr-2" /> All Orders
      </h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="w-full max-w-4xl grid gap-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center w-full"
            >
              <div>
                <h3 className="text-lg font-bold">Order #{order.order_id}</h3>
                <p className="text-gray-600">User: {order.username}</p>
                <p className="text-gray-600">Date: {order.order_date}</p>
                <p className="text-gray-600">Total: <span className="font-semibold">₹{order.order_total}</span></p>
                <p className="text-gray-600">
                  Status: <span className="font-semibold text-blue-600">{order.order_status}</span>
                </p>
                <p className="mt-2 text-gray-700 font-medium">Items:</p>
                <ul className="list-disc pl-5 text-gray-700">
                  {order.items.map((item, index) => (
                    <li key={index}>{item.product_id} - {item.qty}</li>
                  ))}
                </ul>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                onClick={() => setSelectedOrder(order)}
              >
                <Pencil size={16} className="mr-1" /> Edit Status
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedOrder && (
        <EditStatusModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={updateOrderStatus}
        />
      )}
    </div>
  );
}
