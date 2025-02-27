import React from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
export default function ProductDeleteModal({ isOpen, onClose, product, onDelete }) {
  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/delete/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      onDelete(); // Refresh the product list after deletion
      onClose();  // Close the modal
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-black">Confirm Delete</h2>
        <p className="text-gray-700 mt-2">
          Are you sure you want to delete <strong>{product.name}</strong>?
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
