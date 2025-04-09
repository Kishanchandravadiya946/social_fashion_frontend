import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateCategory from "./productCategoryCreate";
import UpdateCategory from "./productCategoryUpdate"
import DeleteCategory from "./productCategoryDelete";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function ProductCategoryList() {
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const navigate = useNavigate(); // Use navigate instead of <Link>
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product_category/list`, {
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

  useEffect(() => {
    fetchCategories();
  }, []);
  
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };
  
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  return (
    <div className="flex flex-col  min-h-screen bg-gradient-to-b  p-8 relative">
      <h2 className="mb-4 text-2xl text-black font-semibold space-y-4">
        Product Categories
      </h2>

      <div className="flex justify-between items-center mb-4 ">
        <button
          onClick={() => setCategoryModalOpen(true)}
          className=" bg-blue-400 mb-6 text-black py-3 px-6 rounded-full"
        >
          + Create New Category
        </button>
      </div>
      <CreateCategory
        isOpen={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories available.</p>
      ) : (
        <>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="w-full bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between border-2 border-blue-500"
              >
                <span className="text-black font-medium p-2">
                  {category.category_name}
                </span>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    onClick={() => handleEditClick(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteClick(category)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <UpdateCategory
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            category={selectedCategory}
            onUpdate={() => fetchCategories()} // Refresh category list after update
          />
          <DeleteCategory
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            category={selectedCategory}
            onDelete={() => fetchCategories()} // Refresh categories after delete
          />
        </>
      )}
    </div>
  );
}