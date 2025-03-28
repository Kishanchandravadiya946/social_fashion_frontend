import Navbar from "../component/navbar";
import ProductList from "./productList";
import ParentCategories from "./parentsCategories";
import ChildCategories from "./childCategories";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useEffect, useState } from "react";
const Product = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product_category/list`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        // console.log(data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div>
      <Navbar />

      <button
        onClick={() => setShowFilters(true)}
        className="md:hidden bg-blue-500 text-white px-4 py-2 rounded fixed top-16 left-4 z-50 shadow-lg"
      >
        Filters
      </button>

      <div className="flex flex-col md:flex-row">
        {showFilters && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowFilters(false)}
          ></div>
        )}
        <div
          className={`fixed md:relative top-0 left-0 w-3/4 md:w-1/4 h-full md:h-auto bg-white p-4 border-r border-gray-300 shadow-lg transition-transform transform ${
            showFilters ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-50`}
        >
          <button
            onClick={() => setShowFilters(false)}
            className="md:hidden text-red-500 absolute top-2 right-4 text-lg"
          >
            <FaTimes />
          </button>

          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <ParentCategories
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedCategories={setSelectedCategories}
          />

          <ChildCategories
            categories={categories}
            selectedCategory={selectedCategory}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        {/* Product List Section */}
        <div className="w-full md:w-3/4">
          <ProductList
            selectedCategory={selectedCategory}
            selectedCategories={selectedCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
