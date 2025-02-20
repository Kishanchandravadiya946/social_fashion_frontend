import { FaCheckCircle } from "react-icons/fa"; // Importing green tick icon

const ParentCategories = ({ categories, selectedCategory, setSelectedCategory,setSelectedCategories }) => {
  const parentCategories = categories.filter((cat) => !cat.parent_category_id);

  return (
    <div className="border-2 border-cyan-400 rounded-md p-4"> {/* Square border around all categories */}
      <ul>
        {parentCategories.map((category) => (
          <li
            key={category.id}
            className={`p-2 cursor-pointer hover:bg-black-200 rounded-md border-2 flex items-center justify-between mb-2 ${
              selectedCategory === category.id ? "border-blue-500 font-semibold" : "border-transparent"
            }`}
            onClick={() => (setSelectedCategory(category.id),setSelectedCategories([]))}
          >
            {category.category_name}
            {selectedCategory === category.id && (
              <FaCheckCircle className="text-green-500" /> // Green tick for selected category
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParentCategories;
