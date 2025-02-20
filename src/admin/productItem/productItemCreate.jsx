import { useState, useEffect } from "react";

export default function ProductItemModal({ isOpen, onClose }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [SKU, setSKU] = useState("");
  const [qtyInStock, setQtyInStock] = useState("");
  const [price, setPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/product/list");
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, [isOpen]);

  const handleCreateProductItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("SKU", SKU);
    formData.append("qty_in_stock", qtyInStock);
    formData.append("price", price);
    if (productImage) formData.append("product_image", productImage);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5050/product_item/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product item");
      }
      onClose();
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
        <h2 className="text-xl font-bold text-center mb-4">Create Product Item</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleCreateProductItem} className="space-y-4">
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="SKU"
            value={SKU}
            onChange={(e) => setSKU(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Quantity in Stock"
            value={qtyInStock}
            onChange={(e) => setQtyInStock(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProductImage(e.target.files[0])}
            className="w-full text-gray-700 border p-2 rounded-lg"
          />

          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
