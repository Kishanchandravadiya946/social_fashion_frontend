import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/product_category/list");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
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
      const response = await fetch("http://127.0.0.1:5050/product_category/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: categoryName,
          parent_category_id: parentCategory || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      // navigate("/product-category"); // Redirect after success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      <div className="bg-opacity-20 bg-gray-100 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          CREATE CATEGORY
        </h2>

        <div className="flex justify-center mb-4">
          <span className="text-white cursor-pointer">Back</span>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white placeholder-white rounded-lg focus:outline-none"
            required
          />

          <select
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white rounded-lg focus:outline-none"
            value={parentCategory || ""}
            onChange={(e) => {setParentCategory(e.target.value || null)}}
          >
            <option value="">No Parent Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.category_name}>
                {category.category_name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-green-400 text-black font-semibold py-3 rounded-full hover:bg-green-500 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
