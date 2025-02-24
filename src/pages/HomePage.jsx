import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for React Router v6
import AdminDashboard from '../admin/adminHome';
import HomeDashboard from '../user/userDashboard';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [id,setUserId]=useState(null);
  const navigate = useNavigate(); // To handle redirects

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    // console.log(user_id);
      setUserId(user_id);
      setLoading(false); 
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (id == 2) {
    return <AdminDashboard/>; 
  } else {
    return <HomeDashboard user_id={id}/>;
    }
}
