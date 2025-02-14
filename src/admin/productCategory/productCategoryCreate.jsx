import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, AlertCircle, Home, Box, List, Package, LogOut } from "lucide-react";

import AdminDashboard from "../home";
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
      navigate( -1);  // Redirect after success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

// const menuItems = [
//     { name: "Home", icon: Home, link: "/", component: () => <h2>Home Page</h2> },
//     { name: "Product Category", icon: List, link: "/product-category", component: ProductCategoryList },
//     { name: "Product", icon: Box, link: "/product", component: ProductList },
//     { name: "Product Item", icon: Package, link: "/product-item", component: ProductItemPage },
//   ];

//   const ActiveComponent = menuItems.find((item) => item.name === active)?.component || (() => <h2>Page Not Found</h2>);

  

  return (
    <div className="flex h-screen">
       <AdminDashboard> </AdminDashboard>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="text-gray-700 font-medium">Welcome, Admin</div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6 bg-white shadow-md m-4 rounded-lg">
          <div className="bg-gray-800 p-10 rounded-lg shadow-2xl w-96 mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-6 uppercase">
              Create Category
            </h2>
            {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
            <form onSubmit={handleCreateCategory} className="space-y-6">
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none border border-gray-600 focus:ring-2 focus:ring-gray-400"
                required
              />
              <select
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none border border-gray-600 focus:ring-2 focus:ring-gray-400"
                value={parentCategory || ""}
                onChange={(e) => setParentCategory(e.target.value || null)}
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
                className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 disabled:bg-gray-400 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin inline-block mr-2" /> : "Create Category"}
              </button>
            </form>
          </div>
        </main>
        {/* Footer */}
        <footer className="bg-gray-900 text-white text-center p-3 mt-4">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
