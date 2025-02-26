import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa"; 
import ProfileDropdown from "./profile/profiledropdown";


const Navbar = ({ user_id }) => {
  const navigate = useNavigate();
 

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>SOCIAL FASHION</div>
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
          onClick={() => navigate('/product',{ state: { id:user_id  } })} 
          className="hover:text-blue-600 cursor-pointer"
        >
          Product
        </button>
      </li>
    </ul>
    
      <div className="flex gap-4">
        <FaShoppingCart className="text-xl cursor-pointer" />
        {user_id && (
        <button 
          onClick={() => navigate("/wishlist",{ state: { id:user_id  } })} 
          className="border px-4 py-1 rounded-full flex items-center gap-2 hover:bg-black hover:text-white"
        >
          <FaRegHeart className="text-red-500" />
        </button>
      )}
        {user_id ? (
          <>   
           <ProfileDropdown user={user_id}/> 
          </>
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
