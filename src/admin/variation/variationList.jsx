import { useEffect, useState } from "react";
import CreateVariationPopup from "./variationCreate";

export default function VariationList() {
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVariationModalOpen, setVariationModalOpen] = useState(false);

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5050/variation/list", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch variations");
        }

        const data = await response.json();
        // console.log(data);
        setVariations(data);
      } catch (err) {
        setError("Failed to fetch variations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVariations();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Variations</h2>
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
              className="w-full bg-gray-100 p-4 rounded-lg shadow-sm flex items-center"
            >
              <span className="text-lg font-medium">{variation.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
