import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function CreateCategory({ isOpen, onClose }) {
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product_category/list`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/product_category/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: categoryName,
          parent_category_id: parentCategory || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create category");

      onClose(); // Close modal after success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-black text-center mb-4">CREATE CATEGORY</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={parentCategory || ""}
            onChange={(e) => setParentCategory(e.target.value || null)}
          >
            <option value="">No Parent Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.category_name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>

        <button onClick={onClose} className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
}
