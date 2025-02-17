import { useState, useEffect } from "react";

export default function CreateVariationPopup({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/product_category/list");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleCreateVariation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5050/variation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category_id: categoryId, name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create variation");
      }
      const result = await response.json();
      setMessage(result.message);
      setCategoryId("");
      setName("");
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
        <h2 className="text-2xl font-bold text-center mb-4">Create Variation</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}

        <form onSubmit={handleCreateVariation} className="space-y-4">
          <select
            className="w-full p-3 border rounded-lg"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Variation Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Variation"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
