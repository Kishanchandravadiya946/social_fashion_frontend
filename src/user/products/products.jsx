import Navbar from "../component/navbar";
import ProductList from "./productList";
import ParentCategories from "./parentsCategories";
import ChildCategories from "./childCategories";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

import { useEffect, useState } from "react";
const Product = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {      
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/product_category/list`,
          {
            method: "GET",
          }
        );

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
      <Navbar  />
      <div className="flex">
        <div className="w-1/4 p-4 border-r border-gray-300">
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

        <ProductList
          selectedCategory={selectedCategory}
          selectedCategories={selectedCategories}
        />
      </div>
    </div>
  );
};

export default Product;
