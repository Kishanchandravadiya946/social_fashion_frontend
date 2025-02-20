import { useEffect, useState } from "react";
import VariationOptionCreate from "./variationOptionCreate";

export default function VariationOptionList() {
  const [variationOptions, setVariationOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVariationOptionModalOpen, setVariationOptionModalOpen] = useState(false);

  useEffect(() => {
    const fetchVariationOptions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/variation_option/list", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch variation options");
        }

        const data = await response.json();
        setVariationOptions(data);
      } catch (err) {
        setError("Failed to fetch variation options. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVariationOptions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Variation Options</h2>
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
              className="w-full bg-gray-100 p-4 rounded-lg shadow-sm flex items-center"
            >
              <span className="text-lg font-medium">{option.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
