import React from "react";

const ProductItemCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      {/* Product Image */}
      <img
        src={product.product_image || "https://via.placeholder.com/300"}
        alt={product.SKU}
        className="w-full h-56 object-cover"
      />

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.SKU}</h3>
        <p className="text-gray-500">
          Price: <span className="font-bold text-green-500">${product.price}</span>
        </p>
        <p className={`text-sm ${product.qty_in_stock > 0 ? "text-green-500" : "text-red-500"}`}>
          {product.qty_in_stock > 0 ? `In Stock: ${product.qty_in_stock}` : "Out of Stock"}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">Edit</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Delete</button>
          <button className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductItemCard;
