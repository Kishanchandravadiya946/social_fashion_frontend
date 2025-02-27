import { useEffect, useState } from "react";
import VariationOptionCreate from "./variationOptionCreate";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function VariationOptionList() {
  const [variationOptions, setVariationOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVariationOptionModalOpen, setVariationOptionModalOpen] = useState(false);
  const [variationMap, setVariationMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [optionsRes, variationsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/variation_option/list`),
          fetch(`${API_BASE_URL}/variation/list`),
          fetch(`${API_BASE_URL}/product_category/list`),
        ]);

        if (!optionsRes.ok || !variationsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const optionsData = await optionsRes.json();
        const variationsData = await variationsRes.json();
        const categoriesData = await categoriesRes.json();

        const variationMap = variationsData.reduce((acc, variation) => {
          acc[variation.id] = { name: variation.name, category_id: variation.category_id };
          return acc;
        }, {});

        const categoryMap = categoriesData.reduce((acc, category) => {
          acc[category.id] = category.category_name;
          return acc;
        }, {});

        setVariationMap(variationMap);
        setCategoryMap(categoryMap);

        // Merge data into variation options
        const enrichedOptions = optionsData.map(option => ({
          ...option,
          variation_name: variationMap[option.variation_id]?.name || "Unknown",
          category_name: categoryMap[variationMap[option.variation_id]?.category_id] || "N/A",
        }));
          
        setVariationOptions(enrichedOptions);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleAddVariationOption = (newOption) => {
    const enrichedOption = {
      ...newOption,
    };
    console.log(enrichedOption)
    setVariationOptions(prevOptions => [...prevOptions, enrichedOption]);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black text-2xl font-semibold">Variation Options</h2>
        <button
          onClick={() => setVariationOptionModalOpen(true)}
          className="bg-blue-400 text-black py-3 px-6 rounded-full"
        >
          + Create New Option
        </button>
      </div>

      {/* Popup for Creating Variation Option */}
      <VariationOptionCreate
        isOpen={isVariationOptionModalOpen}
        onClose={() => setVariationOptionModalOpen(false)}
        onAddVariationOption={handleAddVariationOption}
      />

      {loading ? (
        <p className="text-gray-500">Loading variation options...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : variationOptions.length === 0 ? (
        <p className="text-gray-500 text-center">No variation options available.</p>
      ) : (
        <div className="space-y-4">
          {variationOptions.map((option) => (
           <div
           key={option.id}
           className="w-full flex items-center rounded-lg shadow-sm border"
         >
      
           <div className="w-1/3 bg-blue-200 text-blue-900 font-semibold px-4 py-3 rounded-l-lg flex justify-center items-center">
            {option.value}
          </div>
    
          <div className="w-2/3 bg-green-200 text-green-900 font-semibold px-4 py-3 rounded-r-lg flex justify-center items-center">
            {option.variation_name} -- {option.category_name}
          </div>
         </div>
          ))}
        </div>
      )}
    </div>
  );
}
