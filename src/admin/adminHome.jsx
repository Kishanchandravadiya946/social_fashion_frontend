import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { Home, Box, List, Package,LogOutIcon, TvIcon, Laptop2Icon } from "lucide-react";
import ProductCategoryList from "./productCategory/productCategory";
import ProductList from "./product/product";
import ProductItemPage from "./productItem/productItem";
import Logout from "../pages/Logout";
import VariationList from "./variation/variationList";
import VariationOptionList from "./variation_option/variationOptionList";

export default function AdminDashboard() {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", icon: Home, link: "/", component: () => <h2>Home Page</h2> },
    { name: "Product Category", icon: List, link: "/product-category", component: ProductCategoryList },
    { name: "Product", icon: Box, link: "/product", component: ProductList },
    { name: "Product Item", icon: Package, link: "/product-item", component: ProductItemPage },
    {name:"Variation",icon:TvIcon,link:"/variation",component:VariationList},
    {name:"Variation Option",icon:Laptop2Icon,link:"/variation-option",component:VariationOptionList},
    {name:"Logout",icon:LogOutIcon,link:"/logout",component:Logout},
  ];

  const ActiveComponent = menuItems.find((item) => {
    if (item.name === "Logout") {
      navigate("/logout");
      return false; 
    }
    return item.name === active;
  })?.component || (() => <h2>Page Not Found</h2>);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
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

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="text-gray-700 font-medium">Welcome, Admin</div>
        </header>

        <main className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <ActiveComponent />
        </main>

        <footer className="bg-gray-900 text-white text-center p-3">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
