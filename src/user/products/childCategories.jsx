import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa"; // Importing green tick icon

const ChildCategories = ({
  categories,
  selectedCategory,
  searchParams,
  setSearchParams,
  selectedCategories,
  setSelectedCategories,
}) => {
  const childCategories = categories.filter(
    (cat) => cat.parent_category_id === selectedCategory?.id
  );

  const toggleCategory = (categoryId) => {
    setSelectedCategories(
      (prevSelected) =>
        prevSelected.includes(categoryId)
          ? prevSelected.filter((id) => id !== categoryId) // Remove if already selected
          : [...prevSelected, categoryId] // Add if not selected
    );
  };
  useEffect(() => {
    setSearchParams({
      f: selectedCategories.map((SC) => SC.category_name).join(","),
    });
  }, [selectedCategories]);

  useEffect(() => {
    const selectedCategoryNames = searchParams.get("f")?.split(",") || [];

    const updatedSelectedCategories = categories.filter((cat) =>
      selectedCategoryNames.includes(cat.category_name)
    );

    setSelectedCategories(updatedSelectedCategories);
  }, [searchParams]);

  return (
    <div className="border-2 border-cyan-400 rounded-md p-4 mt-4">
      {" "}
      {/* Border added */}
      <h3 className="font-medium mb-2">Categories</h3>
      {selectedCategory?.id && (
        <>
          <ul>
            {childCategories.length > 0 ? (
              childCategories.map((subCategory) => (
                <li
                  key={subCategory.id}
                  className={`p-2 cursor-pointer hover:bg-black-200 rounded-md flex items-center justify-between mb-2 ${
                    selectedCategories.includes(subCategory)
                      ? "border-blue-500 font-semibold"
                      : "border-transparent"
                  }`}
                  onClick={() => toggleCategory(subCategory)}
                >
                  <span>{subCategory.category_name}</span>
                  {selectedCategories.includes(subCategory) && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No subcategories available</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default ChildCategories;
