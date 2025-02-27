import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 


const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email_address: formData.email,
          phone_number: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("User created successfully!");
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setError(data.error || "Something went wrong.");
      }  
    } 
    catch (error) {
      setError("Network error. Please try again.");
    }finally{
    setLoading(false);}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white-900 to-indigo-800">
      <div className="w-full max-w-md p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          SOCIAL FASHION
        </h1>

        <div className="flex justify-center space-x-8 mb-6">
          <a href="/login">
            <button className="text-gray-300 pb-1 hover:text-white">
              Sign In
            </button>
          </a>
          <button className="text-white border-b-2 border-green-400 pb-1">
            Sign Up
          </button>
        </div>

       
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 bg-white/20 text-white rounded-md placeholder-gray-300 focus:ring-2 focus:ring-green-400"
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-white">
              <i className="fas fa-user"></i>
            </span>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 bg-white/20 text-white rounded-md placeholder-gray-300 focus:ring-2 focus:ring-green-400"
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-white">
              <i className="fas fa-envelope"></i>
            </span>
          </div>

          <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 bg-white/20 text-white rounded-md placeholder-gray-300 focus:ring-2 focus:ring-green-400"
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-white">
              <i className="fas fa-phone"></i>
            </span>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 bg-white/20 text-white rounded-md placeholder-gray-300 focus:ring-2 focus:ring-green-400"
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-white">
              <i className="fas fa-lock"></i>
            </span>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-white"
            >
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 bg-white/20 text-white rounded-md placeholder-gray-300 focus:ring-2 focus:ring-green-400"
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-white">
              <i className="fas fa-lock"></i>
            </span>
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-white"
            >
              <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 text-center text-blue-900 bg-green-400 rounded-full font-bold hover:bg-green-500"
            disabled={loading}
          > 
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
