import { useEffect, useState } from "react";

const ProductList = ({ selectedCategory, selectedCategories }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!selectedCategory) return; // Don't fetch if no category is selected

    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5050/product_item/category/${selectedCategory}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        // console.log(data.product_items);
        setProducts(data.product_items);
      } catch (error) {
        setProducts([]);
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="w-3/4 p-4">
      <h2 className="text-lg font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.SKU} className="border p-2 rounded">
            <img src={product.product_image} alt={product.SKU} className="w-full h-40 object-cover" />
            {/* <h3 className="font-semibold mt-2">{product.name}</h3> */}
            <p className="text-gray-600">Rs. {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
