import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Avatar from "./avatar";
import { Card, CardContent } from "./card";
import Button from "./button";
import { FaUser, FaHeart, FaSignOutAlt, FaCog } from "react-icons/fa"; // Import icons
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function ProfileDropdown({ user_id, mobile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const handleLogout = () => {
    navigate("/logout");
  };

  useEffect(() => {
    fetchUser();
  }, [user_id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // If JWT is needed
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      // console.log("User Data:", data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const abc = async () => {
    try {
      console.log("abccccccccccccccccccccc");
      setIsOpen(!isOpen);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => abc()} className="flex items-center">
        <Avatar
          name={user?.username}
          src={user?.profilePicture}
          className="w-10 h-10"
        />
      </button>
      {isOpen && (
        <div className={`${mobile ? "relative":"absolute"} right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50`}>
          <Card>
            <CardContent className="p-2">
              <div className="flex items-center p-2">
                <Avatar
                  name={user?.username}
                  src={user?.profilePicture}
                  className="w-8 h-8"
                />
                <div className="ml-2">
                  <p
                    onClick={() =>
                      navigate("/profile", { state: { id: user_id } })
                    }
                    className="text-black font-medium cursor-pointer"
                  >
                    {user?.username || "Guest"}
                  </p>
                </div>
              </div>
              <button
                // onClick={() => navigate("/settings", { state: { id: user_id } })}
                className="text-black flex items-center p-2 hover:bg-gray-100 rounded w-full"
              >
                <FaCog className="text-black w-5 h-5 mr-2" /> Settings
              </button>
              <button
                onClick={() =>
                  navigate("/wishlist", { state: { id: user_id } })
                }
                className="text-black flex items-center p-2 hover:bg-gray-100 rounded w-full"
              >
                <FaHeart className="text-black w-5 h-5 mr-2" />
                wishlist
              </button>
              <button
                onClick={handleLogout}
                className="text-black flex items-center p-2 hover:bg-gray-100 rounded w-full"
              >
                <FaSignOutAlt className="text-black w-5 h-5 mr-2" />
                Logout
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
