import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Box,
  List,
  Package,
  LogOutIcon,
  TvIcon,
  Laptop2Icon,
  ClipboardList,
  ShoppingCart,
  PackageCheck,
  Menu,
} from "lucide-react"; // Import the menu icon
import ProductCategoryList from "./productCategory/productCategory";
import ProductList from "./product/product";
import ProductItemPage from "./productItem/productItem";
import Logout from "../pages/Logout";
import VariationList from "./variation/variationList";
import VariationOptionList from "./variation_option/variationOptionList";
import OrderList from "./order/order";

export default function AdminDashboard() {
  const [active, setActive] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to toggle the sidebar
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Home",
      icon: Home,
      link: "/",
      component: () => <h2>Home Page</h2>,
    },
    {
      name: "Product Category",
      icon: List,
      link: "/product-category",
      component: ProductCategoryList,
    },
    { name: "Product", icon: Box, link: "/product", component: ProductList },
    {
      name: "Product Item",
      icon: Package,
      link: "/product-item",
      component: ProductItemPage,
    },
    {
      name: "Variation",
      icon: TvIcon,
      link: "/variation",
      component: VariationList,
    },
    {
      name: "Variation Option",
      icon: Laptop2Icon,
      link: "/variation-option",
      component: VariationOptionList,
    },
    {
      name: "Orders",
      icon: ClipboardList,
      link: "/order",
      component: OrderList,
    },
    { name: "Logout", icon: LogOutIcon, link: "/logout", component: Logout },
  ];

  const ActiveComponent =
    menuItems.find((item) => {
      if (item.name === "Logout") {
        navigate("/logout");
        return false;
      }
      return item.name === active;
    })?.component || (() => <h2>Page Not Found</h2>);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white p-5 flex flex-col 
    fixed top-0 left-0 w-64 h-screen z-50 
    transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    transition-all ease-in-out duration-300 
    lg:fixed lg:translate-x-0 lg:w-64 lg:z-auto lg:h-screen `}
      >
        <button
          className="absolute top-4 right-4 text-white p-2 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          ✕ {/* Unicode close icon */}
        </button>
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                setSidebarOpen(false); // Close the sidebar after clicking
              }}
              className={`flex items-center gap-3 p-2 rounded-lg w-full text-left transition ${
                active === item.name ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all ease-in-out duration-300 lg:ml-64`}
      >
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center ">
          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-black text-xl font-semibold">Admin Dashboard</h1>
          <div className="text-black font-medium">Welcome, Admin</div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-6 bg-gray-100 flex items-center justify-center ">
          <ActiveComponent />
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white text-center p-3">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
