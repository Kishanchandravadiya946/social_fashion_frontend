import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function VariationOptionCreate({ isOpen, onClose,onAddVariationOption }) {
  const [variations, setVariations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variationId, setVariationId] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [variationsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/variation/list`),
          fetch(`${API_BASE_URL}/product_category/list`)
        ]);

        if (!variationsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const variationsData = await variationsRes.json();
        const categoriesData = await categoriesRes.json();

        // Map categories by ID for quick lookup
        const categoryMap = categoriesData.reduce((acc, category) => {
          acc[category.id] = category.category_name;
          return acc;
        }, {});

        // Merge category names into variations
        const mergedVariations = variationsData.map(variation => ({
          ...variation,
          category_name: categoryMap[variation.category_id] || "Unknown"
        }));

        setVariations(mergedVariations);
        setCategories(categoriesData);
      } catch (err) {
        setError("Error loading data");
      }
    };

    fetchData();
  }, [isOpen]);


  const handleCreateVariationOption = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/variation_option/create`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ variation_id: variationId, value }),
      });

      if (!response.ok) {
        throw new Error("Failed to create variation option");
      }

      const variation = variations.find(v => v.id === parseInt(variationId, 10));
      console.log(variation)

      setSuccess("Variation option created successfully!");
      onAddVariationOption({
        value:value,
        variation_name: variation.name || "Unknown",
        category_name: variation.category_name || "N/A",
      });
      setVariationId("");
      setValue("");
      setSuccess("");
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-black text-2xl font-semibold mb-4">Create Variation Option</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={handleCreateVariationOption} className="space-y-4">
          <select
            value={variationId}
            onChange={(e) => setVariationId(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none"
            required
          >
            <option value="">Select Variation</option>
            {variations.map((variation) => (
              <option key={variation.id} value={variation.id}>
                {variation.name}- <span className="text-gray-500">{variation.category_name}</span>
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Option Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none"
            required
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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
