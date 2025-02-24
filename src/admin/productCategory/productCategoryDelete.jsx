import React from "react";

export default function ProductCategoryDelete({ isOpen, onClose, category, onDelete }) {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5050/product_category/delete/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      onDelete(); // Refresh categories after successful deletion
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg text-black font-semibold mb-4"> Are you sure you want to delete ?</h3>
        <div className="flex justify-center gap-4"> 
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
