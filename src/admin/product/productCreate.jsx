import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
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
        console.error(err.message);
      }
    };
    fetchCategories();
    // print(categories)
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("name", name);
    formData.append("description", description);
    if (productImage) formData.append("product_image", productImage);

    try {
      const response = await fetch("http://127.0.0.1:5050/product/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

    //   navigate("/products"); // Redirect after success
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
          CREATE PRODUCT
        </h2>

        {/* <div className="flex justify-center mb-4">
          <span className="text-white cursor-pointer" onClick={() => navigate("/products")}>
            Back
          </span>
        </div> */}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleCreateProduct} className="space-y-4">
          <select
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white rounded-lg focus:outline-none"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.category_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white placeholder-white rounded-lg focus:outline-none"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white placeholder-white rounded-lg focus:outline-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProductImage(e.target.files[0])}
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white rounded-lg focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-green-400 text-black font-semibold py-3 rounded-full hover:bg-green-500 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
