import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const token = localStorage.getItem("token");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        if(token){
        const response = await fetch("http://127.0.0.1:5050/user/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {

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
