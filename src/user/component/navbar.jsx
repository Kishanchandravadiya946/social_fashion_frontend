import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate()
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="text-xl font-bold">SOCIAL FASHION</div>
      <ul className="flex gap-6">
        {["Home", "Shop", "Products", "About Us", "Contact"].map((item) => (
          <li key={item} className="hover:text-blue-600 cursor-pointer">{item}</li>
        ))}
      </ul>
      <div className="flex gap-4">
        <FaShoppingCart className="text-xl cursor-pointer" />
        <button onClick={()=>navigate("/login")}
        className="border px-4 py-1 rounded-full hover:bg-black hover:text-white">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
