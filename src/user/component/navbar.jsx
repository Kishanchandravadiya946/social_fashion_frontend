import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user_id }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="text-xl font-bold">SOCIAL FASHION</div>
      <ul className="flex gap-6">
      <li>
        <button 
          onClick={() => navigate('/')} 
          className="hover:text-blue-600 cursor-pointer"
        >
         Home 
        </button>
      </li>
      {[ "Shop",].map((item) => (
        <li key={item} className="hover:text-blue-600 cursor-pointer">{item}</li>
      ))}
      <li>
        <button 
          onClick={() => navigate('/product')} 
          className="hover:text-blue-600 cursor-pointer"
        >
          Product
        </button>
      </li>
    </ul>
      <div className="flex gap-4">
        <FaShoppingCart className="text-xl cursor-pointer" />
        {user_id ? (
          <button onClick={handleLogout}
            className="border px-4 py-1 rounded-full hover:bg-black hover:text-white">
            Logout
          </button>
        ) : (
          <button onClick={() => navigate("/login")}
            className="border px-4 py-1 rounded-full hover:bg-black hover:text-white">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
