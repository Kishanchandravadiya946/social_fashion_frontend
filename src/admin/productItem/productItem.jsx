import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductItemModal from "./productItemCreate";
import ProductItemUpdate from "./productitemUpdate";
import ProductItemDelete from "./productitemDelete";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 


export default function ProductItemPage() {
  const [productItems, setProductItems] = useState([]);
  const [isProductItemOpen,setProductItemOpen]=useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductItem, setSelectedProductItem] = useState(null);
  const navigate = useNavigate();

  const fetchProductItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product_item/list`);
      const data = await response.json();
      // console.log(data)
      setProductItems(data);
    } catch (error) {
      console.error("Error fetching product items:", error);
    }
  };

  useEffect(() => {
    fetchProductItems();
  }, []);

 
// console.log(productItems);
  return (
    <div className="flex flex-col  min-h-screen bg-gradient-to-b  p-8 relative">
      <div className="bg-opacity-20 bg-gray-100 ">
        <h2 className="text-2xl font-bold text-black text-center mb-4">
          PRODUCT ITEMS
        </h2>

        <div className="flex justify-between mb-4">
          <button
            className="bg-green-400 text-black font-semibold py-2 px-4 rounded-full hover:bg-green-500"
            onClick={() => setProductItemOpen(true)}
          >
            +Create Product Item
          </button>
          <ProductItemModal
            isOpen={isProductItemOpen}
            onClose={() => setProductItemOpen(false)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-lg relative"
            >
              <img
                src={item.product_image || "https://via.placeholder.com/150"}
                alt={item.SKU}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-xl text-black font-bold mt-2">
                SKU: {item.SKU}
              </h3>
              <p className="text-gray-600">Stock: {item.qty_in_stock}</p>
              <p className="text-gray-800 font-semibold">
                Price: ₹ {item.price.toFixed(2)}
              </p>
              {/* Edit Button */}
              <button
                className="mt-3 mb-3 absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                onClick={() => {
                  setSelectedProductItem(item);
                  setIsUpdateModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="mt-3 mb-3  bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                onClick={() => {
                  setSelectedProductItem(item);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <ProductItemUpdate
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        productItem={selectedProductItem}
        refreshProductItems={fetchProductItems}
      />
      <ProductItemDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productItem={selectedProductItem}
        refreshProductItems={fetchProductItems}
      />
    </div>
  );
}
