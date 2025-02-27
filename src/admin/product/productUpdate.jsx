import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function ProductUpdateModal({ product, onClose, onUpdate }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(product.category_id || "");
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(product.product_image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product_category/list`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
        console.log(product)
        setCategoryId(product.category_id || ""); // Ensure the category dropdown selects the correct value after loading categories
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCategories();
  }, [product.category_id]);//update when product changes

   // Handle image selection and preview
   const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("name", name);
    formData.append("description", description);
    if (productImage) formData.append("product_image", productImage);

    try {
      // console.log(formData)
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/product/update/${product.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      onUpdate(); // Refresh product list after update
      onClose(); // Close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          ✖
        </button>

        <h2 className="text-2xl font-bold text-black text-center mb-4">EDIT PRODUCT</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
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
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />

          <div className="flex flex-col items-center">
            {previewImage && <img src={previewImage} alt="Product Preview" className="w-32 h-32 object-cover rounded-md mb-2" />}
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none" />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
