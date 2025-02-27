import { useEffect, useState } from "react";
import CreateVariationPopup from "./variationCreate";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function VariationList() {
  const [variations, setVariations] = useState([]);
  const [categorymap, setcategorymap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVariationModalOpen, setVariationModalOpen] = useState(false);

  useEffect(() => {
    fetchVariations();
  }, []);

    const fetchVariations = async () => {
      setLoading(true);
      setError(null);
  
      try{
      const resVariations = await fetch(`${API_BASE_URL}/variation/list`);
      const resCategories = await fetch(`${API_BASE_URL}/product_category/list`);
      
      if (!resVariations.ok || !resCategories.ok) {
        setError("Failed to fetch data.");
        setLoading(false);
        return;
      }
  
      const variationsData = await resVariations.json();
      const categoriesData = await resCategories.json();
  
      // Map category names into variations
      const categoryMap = new Map(categoriesData.map(cat => [cat.id, cat.category_name]));
     
      setcategorymap(categoryMap);
      const updatedVariations = variationsData.map(variation => ({
        ...variation,
        categoryName: categoryMap.get(variation.category_id)
      }));
  
      setVariations(updatedVariations);
     
    }catch(err){
      setError("Failed to fetch variations. Please try again.");
    }finally{
      setLoading(false);
    }
    };
  
   const handleVariationCreated = (newVariation) => {
    console.log(newVariation)
    setVariations(prevVariations => [
      ...prevVariations,
      {
        ...newVariation,
        categoryName: categorymap.get(newVariation.category_name) // Assuming API returns category_name
      }
    ]);
  };  


  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black text-2xl font-semibold">Variations</h2>
        <button
          onClick={() => setVariationModalOpen(true)}
          className="bg-blue-400 text-black py-3 px-6 rounded-full"
        >
          + Create New Variation
        </button>
      </div>

      {/* Popup for Creating Variation */}
      <CreateVariationPopup
        isOpen={isVariationModalOpen}
        onClose={() => setVariationModalOpen(false)}
        onVariationCreated={handleVariationCreated}
      />

      {loading ? (
        <p className="text-gray-500">Loading variations...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : variations.length === 0 ? (
        <p className="text-gray-500 text-center">No variations available.</p>
      ) : (
        <div className="space-y-4">
          {variations.map((variation) => (
            <div
            key={variation.id}
            className="w-full bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
          >
            {/* Variation Name */}
            <span className="text-lg text-black font-medium">{variation.name}</span>
          
            {/* Category Name Box */}
            <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-lg">
              {variation.categoryName}
            </span>
          </div>
          
          ))}
        </div>
      )}
    </div>
  );
}
