import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Box, List, Package,LogOut, BarChart, Bell, ClipboardCheck } from "lucide-react";
import ProductCategoryList from "./productCategory/productCategory";
import ProductList from "./product/product";
import ProductItemPage from "./productItem/productItem";
import Sidebar from "./Sidebar";

export default function AdminDashboard() {
  const [ActiveComponent, setActive] = useState("Home");
  console.log(ActiveComponent)

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
       <Sidebar handleSubmit={(data)=>setActive(data)} ></Sidebar>
  
      {/* Mai Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="text-gray-700 font-medium">Welcome, Admin</div>
        </header>


         {/* Content */}
         <main className="flex-1 p-6 bg-white shadow-md m-4 rounded-lg">
          {/* <ActiveComponent /> */}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white text-center p-3 mt-4">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}


function HomePage() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="bg-blue-500 text-white p-6 rounded-lg flex items-center gap-4">
        <BarChart className="w-10 h-10" />
        <div>
          <h3 className="text-lg font-bold">Sales Overview</h3>
          <p className="text-sm">Monthly Revenue: $12,500</p>
        </div>
      </div>
      <div className="bg-yellow-500 text-white p-6 rounded-lg flex items-center gap-4">
        <Bell className="w-10 h-10" />
        <div>
          <h3 className="text-lg font-bold">Notifications</h3>
          <p className="text-sm">5 New Orders Pending</p>
        </div>
      </div>
      <div className="bg-green-500 text-white p-6 rounded-lg flex items-center gap-4">
        <ClipboardCheck className="w-10 h-10" />
        <div>
          <h3 className="text-lg font-bold">Tasks</h3>
          <p className="text-sm">Stock Update Required</p>
        </div>
      </div>
    </div>
  );
}