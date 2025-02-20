import { FaCheckCircle } from "react-icons/fa"; // Importing green tick icon

const ChildCategories = ({ categories, selectedCategory, selectedCategories, setSelectedCategories }) => {
  const childCategories = categories.filter((cat) => cat.parent_category_id=== selectedCategory);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId) // Remove if already selected
        : [...prevSelected, categoryId] // Add if not selected
    );
  };

  return (
    <div className="border-2 border-cyan-400 rounded-md p-4 mt-4"> {/* Border added */}
    <h3 className="font-medium mb-2">Categories</h3>
      {selectedCategory && (
        <>
          <ul>
            {childCategories.length > 0 ? (
              childCategories.map((subCategory) => (
                <li
                key={subCategory.id}
                className={`p-2 cursor-pointer hover:bg-black-200 rounded-md border-2 flex items-center justify-between mb-2 ${
                  selectedCategories.includes(subCategory.id) ? "border-blue-500 font-semibold" : "border-transparent"
                }`}
                onClick={() => toggleCategory(subCategory.id)}
              >
                <span>{subCategory.category_name}</span>
                {selectedCategories.includes(subCategory.id) && <FaCheckCircle className="text-green-500" />}
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
