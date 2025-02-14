import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductItemCreate() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [SKU, setSKU] = useState("");
  const [qtyInStock, setQtyInStock] = useState("");
  const [price, setPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

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
    //   navigate("/product-items");
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
          CREATE PRODUCT ITEM
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleCreateProductItem} className="space-y-4">
          <select
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white rounded-lg focus:outline-none"
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
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white rounded-lg focus:outline-none"
            required
          />

          <input
            type="number"
            placeholder="Quantity in Stock"
            value={qtyInStock}
            onChange={(e) => setQtyInStock(e.target.value)}
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white rounded-lg focus:outline-none"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 bg-black bg-opacity-20 text-white rounded-lg focus:outline-none"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProductImage(e.target.files[0])}
            className="w-full text-white bg-black bg-opacity-20 p-2 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-green-400 text-black font-semibold py-3 rounded-full hover:bg-green-500 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
