import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OrderStatusModal({ order, onClose, onUpdate }) {
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(order.order_status_id);
  const [selectedStatusName, setSelectedStatusName] = useState(order.order_status);

  useEffect(() => {
    fetchOrderStatuses();
  }, []);

  const fetchOrderStatuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/order/statuses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setOrderStatuses(data);
        // console.log(data)
      } else {
        console.error("Error fetching order statuses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching order statuses:", error);
    }
  };

  const handleSave = () => {
    // console.log(selectedStatus,selectedStatusName)
    onUpdate(order.order_id, selectedStatus,selectedStatusName); 
    onClose();
    setOrderStatuses(null);
    setSelectedStatusName(null);
  };

  useEffect(()=>{
    orderStatuses.map((odr) => {
        // console.log(odr)
        if (odr.id == selectedStatus) {
            setSelectedStatusName(odr.name);
        }
    });
  },[selectedStatus])
//   console.log(selectedStatus,selectedStatusName)
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Order Status</h2>

        <select
          className="w-full p-2 border rounded"
          value={selectedStatus}
          onChange={(e) => {setSelectedStatus(e.target.value)}}
        >
          {orderStatuses.map((status) => (
            <option key={status.id} value={status.id} >
              {status.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave} // Call handleSave instead of onUpdate directly
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
