import { useState, useEffect } from "react";

export default function UpdateCategory({ isOpen, onClose, category, onUpdate }) {
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log(category)
    if (category) {
      setCategoryName(category.category_name);
      setParentCategory(category.parent_category_id || null);
    }
  }, [category]);

  const handleClose = () => {
    setCategoryName("");
    setParentCategory(null); // Reset parent category
    onClose();
  };
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/product_category/list");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        // console.log(data)
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);


  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5050/product_category/update/${category.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: categoryName,
          parent_category_id: parentCategory || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update category");
      onUpdate(); // Refresh category list
      setCategoryName("");
      setParentCategory(null);
      onClose(); // Close modal after success
    } catch (err) {
      console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-black text-center mb-4">EDIT CATEGORY</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleUpdateCategory} className="space-y-4">
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
            value={parentCategory }
            onChange={(e) => setParentCategory(e.target.value || null)}
          >
            <option value="">No Parent Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </form>

        <button onClick={handleClose} className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
}
