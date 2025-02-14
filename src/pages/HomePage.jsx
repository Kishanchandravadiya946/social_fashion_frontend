import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for React Router v6
import AdminDashboard from '../admin/adminHome';
import HomeDashboard from '../user/userDashboard';

export default function HomePage() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // To handle redirects

  // Function to fetch user role from API
  const fetchUserRole = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:5050/user/check-role', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        navigate('/login');
        throw new Error('Failed to fetch user role');
      }

      const data = await response.json();
      return data.role; 
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
          navigate('/login');
      return;
    }

    const getUserRole = async () => {
      const userRole = await fetchUserRole(token);
      setRole(userRole); 
      setLoading(false); 
    };

    getUserRole();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (role === 'admin') {
    return <AdminDashboard />; 
  } else if (role === 'user') {
    return <HomeDashboard />; 
  } else {
    return <div>Unauthorized or Error: Invalid Role </div>;
  }
}
