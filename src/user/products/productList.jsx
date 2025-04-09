import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../shared/NotificationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductList = ({ selectedCategory, selectedCategories }) => {
  const [products, setProducts] = useState([]);
  const [loading,setloading]=useState(true);
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const queryParams = new URLSearchParams();

  if (selectedCategories.length > 0) {
    queryParams.append(
      "f",
      selectedCategories.map((SC) => SC.category_name).join(",")
    );
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const url = selectedCategory?.id
        ? `${API_BASE_URL}/product_item/category/${
            selectedCategory.id
          }?${queryParams.toString()}`
        : `${API_BASE_URL}/product_item/category/?${queryParams.toString()}`;

      setProducts([]);
      setloading(true);
      const response = await fetch(url, { method: "GET", headers });

      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setloading(false);
      setProducts(data.product_items);
    } catch (error) {
      setProducts([]);
      setloading(false);
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedCategories]);

  const addToWishlist = async (productItemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_item_id: productItemId }),
      });

      const data = await response.json();
      if (response.ok) {
        addNotification("Item added to wishlist", "success");
        setProducts((prevItems) =>
          prevItems.map((item) =>
            item.id === productItemId ? { ...item, wishlist: true } : item
          )
        );
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

 return (
   <div className="w-full h-screen overflow-y-auto p-4 md:p-6">
     <h2 className="text-lg font-semibold mb-4">Products</h2>

     {loading ? (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {[...Array(8)].map((_, index) => (
           <div
             key={index}
             className="border p-4 rounded-lg shadow-md animate-pulse space-y-3"
           >
             <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
             <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
             <div className="h-3 bg-gray-200 rounded w-full"></div>
             <div className="h-3 bg-gray-200 rounded w-5/6"></div>

             <div className="flex items-center justify-between mt-3">
               <div className="h-4 bg-gray-300 rounded w-1/3"></div>
               <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
             </div>
           </div>
         ))}
       </div>
     ) : products.length === 0 ? (
       <div className="text-center text-gray-500 text-lg mt-10">
         No products available.
       </div>
     ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {products.map((product) => (
           <div
             key={product.SKU}
             className="border p-4 rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
             onClick={() =>
               navigate(`/product/${product.product.name}/${product.id}`, {
                 state: { product },
               })
             }
           >
             <div className="w-full h-48 sm:h-56 md:h-60 lg:h-64">
               <img
                 src={product.product_image}
                 alt={product.SKU}
                 className="w-full h-full object-cover rounded-lg"
               />
             </div>

             <h3 className="font-semibold text-lg mt-2">
               {product.product.name}
             </h3>

             <p className="text-gray-500 text-sm">
               {product.product.description}
             </p>

             <div className="flex items-center justify-between mt-3">
               <p className="text-lg font-bold text-black">
                 Rs. {product.price}
               </p>
               <button
                 className="text-gray-600 text-2xl p-2 rounded-full transition-colors duration-200 hover:text-red-500"
                 onClick={(e) => {
                   e.stopPropagation();
                   product.wishlist ? null : addToWishlist(product.id);
                 }}
               >
                 {product.wishlist ? (
                   <FaHeart className="text-red-500" />
                 ) : (
                   <FaRegHeart className="text-gray-600" />
                 )}
               </button>
             </div>
           </div>
         ))}
       </div>
     )}
   </div>
 );

};

export default ProductList;
