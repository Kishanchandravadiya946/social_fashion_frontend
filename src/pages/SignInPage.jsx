import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../shared/NotificationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const { addNotification } = useNotification();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
    
        try {
            const response = await fetch(`${API_BASE_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email_address: email,
                    password: password,
                }),
            });
            // console.log("object");
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("role", data.role);
                // console.log(data);
                addNotification("Login successful!", "success");
                setTimeout(() => navigate("/"), 1000);
            }
            else {
                setError(data.error || "Something went wrong.");
            }  
    
            
        } catch (err) {
           localStorage.removeItem("token");
           localStorage.removeItem("user_id");
            setError(err.message);
        } finally {

            setLoading(false);
        }
    };
    

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white-900 to-indigo-800 px-4">
        <div className="w-full max-w-sm p-8 bg-black opacity-80 backdrop-blur-md rounded-lg shadow-lg sm:max-w-md lg:max-w-lg">
          {/* Logo */}
          <h1 className="text-4xl font-bold text-center text-white mb-6">
            SOCIAL FASHION
          </h1>

          {/* Tabs */}
          <div className="flex justify-center space-x-8 mb-6">
            <button className="text-white border-b-2 border-green-400 pb-1 focus:outline-none">
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-gray-300 pb-1 focus:outline-none hover:text-white"
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 bg-white/20 text-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-white">
                <i className="fas fa-envelope"></i>
              </span>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 bg-white/20 text-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-white">
                <i className="fas fa-lock"></i>
              </span>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-white"
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-center text-white bg-green-400 rounded-full font-bold hover:bg-green-400"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
};

export default SignIn;
