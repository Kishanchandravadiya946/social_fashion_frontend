import { useState, useEffect } from "react";

export default function ProductItemUpdate({ isOpen, onClose, productItem, refreshProductItems }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(productItem?.product_id || "");
  const [SKU, setSKU] = useState(productItem?.SKU || "");
  const [qtyInStock, setQtyInStock] = useState(productItem?.qty_in_stock || "");
  const [price, setPrice] = useState(productItem?.price || "");
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(productItem?.product_image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (!isOpen) return;
    // console.log(productItem)
    setProductId(productItem?.product_id || "");
    setSKU(productItem?.SKU || "");
    setQtyInStock(productItem?.qty_in_stock || "");
    setPrice(productItem?.price || "");
    setPreviewImage(productItem?.product_image || "");
    setProductImage(null);

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/product/list");
        const data = await response.json();
       
        setProducts(data);
        // console.log(data)
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProducts();
  }, [isOpen, productItem]);

  const handleUpdateProductItem = async (e) => {
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
    //   console.log(formData)
      const response = await fetch(`http://127.0.0.1:5050/product_item/update/${productItem.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update product item");
      }

      refreshProductItems();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl font-bold text-black text-center mb-4">Update Product Item</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleUpdateProductItem} className="space-y-4">
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
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

         {previewImage && (
            <img src={previewImage} alt="Product" className="w-full h-32 object-cover rounded-lg mb-2" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setProductImage(e.target.files[0]);
              setPreviewImage(URL.createObjectURL(e.target.files[0]));
            }}
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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
