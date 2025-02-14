import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, AlertCircle } from "lucide-react";

export default function ProductCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate instead of <Link>

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/product_category/list", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-3xl font-semibold text-gray-800">Product Categories</h2>
        <button
          onClick={() => navigate("/admin/create-category")} // Navigate programmatically
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          <Plus className="w-5 h-5" /> Create New Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        <p className="ml-2 text-gray-500">Loading categories...</p>
      </div>
      ) : error ? (
        <div className="flex items-center justify-center text-red-600 py-10">
          <AlertCircle className="w-5 h-5 mr-2" /> {error}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-100 p-5 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-200 transition duration-200 cursor-pointer"
            >
              <span className="text-lg font-medium text-gray-800">{category.category_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
