import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateCategory from "./productCategoryCreate";

export default function ProductCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
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
        // console.log(data);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Categories</h2>
        <button onClick={() => setCategoryModalOpen(true)} className="mb-6 bg-blue-400 text-black py-3 px-6 rounded-full">
        + Create New Category
      </button>
      <CreateCategory isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} />

      </div>

      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories available.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="w-full bg-gray-100 p-4 rounded-lg shadow-sm flex items-center"
            >
              <span className="text-black font-medium ">{category.category_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}