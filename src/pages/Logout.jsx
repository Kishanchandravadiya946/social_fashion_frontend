import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../shared/NotificationContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const Logout = () => {
  const navigate = useNavigate();
 const { addNotification } = useNotification();
  useEffect(() => {
    const handleLogout = async () => {
      try {
        const token = localStorage.getItem("token");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        if(token){
        const response = await fetch(`${API_BASE_URL}/user/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          addNotification("Logout successful!", "success");
          navigate("/");
        } else {
          console.error("Logout failed");
        }
      }
      else{
        navigate("/");
      }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    handleLogout();
  });

  return <h2>Logging out...</h2>;
};

export default Logout;
