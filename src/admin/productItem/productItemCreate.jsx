import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function ProductItemModal({ isOpen, onClose }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [SKU, setSKU] = useState("");
  const [qtyInStock, setQtyInStock] = useState("");
  const [price, setPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product/list`);
        const data = await response.json();
        console.log(data)
        setProducts(data);

      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, [isOpen]);


  useEffect(() => {
    if (!productId) return;
  
    const fetchVariations = async () => {
      try {
        // Step 1: Fetch product details to get the category ID
        const productResponse = await fetch(`${API_BASE_URL}/product/products/${productId}`);
        const productData = await productResponse.json();
        const categoryId = productData.category_id;
  
        if (!categoryId) {
          console.error("Category ID not found for this product.");
          return;
        }
  
        // Step 2: Fetch variations based on category ID
        const variationsResponse = await fetch(`${API_BASE_URL}/variation/${categoryId}`);
        const variationsData = await variationsResponse.json();
  
        // Step 3: Find variations for "size" and "color"
        // const sizeVar = variations.find((v) => v.name.toLowerCase() === "size");
        // const colorVar = variations.find((v) => v.name.toLowerCase() === "color");
  
        const variations = variationsData?.variations || []; 

        // if (!Array.isArray(variations)) {
        //   console.error("variations is not an array:", variations);
        // } else {
          const sizeVar = variations.find((v) => v.name.toLowerCase() === "size");
          const colorVar = variations.find((v) => v.name.toLowerCase() === "color");
          console.log("Size Variation:", sizeVar);
          console.log("Color Variation:", colorVar);
        // }
        
        // Step 4: Fetch size options
        if (sizeVar && sizeVar.id) {
          const sizeResponse = await fetch(`${API_BASE_URL}/variation_option/${sizeVar.id}`);
          const sizeData = await sizeResponse.json();
          console.log(sizeData.options)
          if (sizeData.options) {
            setSizeOptions(sizeData.options); // Extract only the options array
          } else {
            setSizeOptions([]);
          }
        } else {
          setSizeOptions([]);
        }
  
        // Step 5: Fetch color options
        if (colorVar) {
          const colorResponse = await fetch(`${API_BASE_URL}/variation_option/${colorVar.id}`);
          const colorData = await colorResponse.json();
          console.log(colorData.options)
          if (colorData.options) {
            setColorOptions(colorData.options); // Extract only the options array
          } else {
            setColorOptions([]);
          }
        } else {
          setColorOptions([]);
        }

      } catch (err) {
        console.error("Failed to load variations", err);
      }
    };
  
    fetchVariations();
  }, [productId]);
  

  const handleCreateProductItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("SKU", SKU);
    formData.append("qty_in_stock", qtyInStock);
    formData.append("price", price);
    formData.append("size_option_id", selectedSize);
    formData.append("color_option_id", selectedColor);
    if (productImage) formData.append("product_image", productImage);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/product_item/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product item");
      }
      console.log(response)
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handelclose= ()=> {
    setProductId(null)
    setSKU("")
    setQtyInStock("")
    setPrice("")
    setSelectedSize("")
    setSelectedColor("")
    setProductImage("")
    onClose()
  }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-black text-center mb-4">Create Product Item</h2>

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

            {/* Size Dropdown */}
          { productId && (
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={selectedSize}
              onChange={(e) => {setSelectedSize(e.target.value),console.log(e.target.value)}}
              required
            >
              <option value="">Select Size</option>
              {sizeOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.value}</option>
              ))}
            </select>
          )}   

          {productId && (
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={selectedColor}
              onChange={(e) => {setSelectedColor(e.target.value),console.log(e.target.value)}}
              required
            >
              <option value="">Select Color</option>
              {colorOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.value}</option>
              ))}
            </select>
           )}

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
              onClick={handelclose}
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