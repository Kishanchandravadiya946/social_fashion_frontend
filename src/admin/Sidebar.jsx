import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Box, List, Package,LogOut, BarChart, Bell, ClipboardCheck } from "lucide-react";
import ProductCategoryList from "./productCategory/productCategory";
import ProductList from "./product/product";
import ProductItemPage from "./productItem/productItem";
export default function Sidebar({handleSubmit}) {
    const [active, setActive] = useState("Home");
  const menuItems = [
    { name: "Home", icon: Home, link: "/", component: () => <h2>Home Page</h2> },
    { name: "Product Category", icon: List, link: "/product-category", component: ProductCategoryList },
    { name: "Product", icon: Box, link: "/product", component: ProductList },
    { name: "Product Item", icon: Package, link: "/product-item", component: ProductItemPage },

  ];

  const senddata = () =>{
    const ActiveComponent = menuItems.find((item) => item.name === active)?.component || (() => <h2>Page Not Found</h2>);
    handleSubmit(ActiveComponent)

  }
   


    return (
        <>
            {/* Sidebar */}
            <aside className="w-72 bg-gray-900 text-white p-5 flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
                <nav className="space-y-2 flex-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() =>
                                {
                                    senddata()
                                    setActive(item.name)
                                }}
                            className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition duration-200 ${active === item.name ? "bg-blue-600" : "hover:bg-gray-800"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-lg">{item.name}</span>
                        </button>
                    ))}
                </nav>
                <button className="flex items-center gap-3 p-3 rounded-lg w-full text-left bg-red-600 hover:bg-red-700 mt-4">
                    {/* <LogOut className="w-5 h-5" /> */}
                    <span className="text-lg">Logout</span>
                </button>
            </aside>
        </>
    )
}