import { useLocation } from "react-router-dom";
import { Home, Box, List, Package } from "lucide-react";
import Sidebar from "./Sidebar";
import ProductCategoryList from "./productCategory/productCategory";
import ProductList from "./product/product";
import ProductItemPage from "./productItem/productItem";
import { useState } from "react";

export default function AdminDashboard() {
  const location = useLocation();

  const [Active,setActive] = useState("Home");

  const menuItems = [
    { name: "Home", icon: Home, link: "/", component: () => <h2>Home Page</h2> },
    { name: "Product Category", icon: List, link: "/product-category", component: ProductCategoryList },
    { name: "Product", icon: Box, link: "/product", component: ProductList },
    { name: "Product Item", icon: Package, link: "/product-item", component: ProductItemPage },
  ];

  const ActiveComponent = menuItems.find((item) => item.name === Active)?.component || (() => <h2>Page Not Found</h2>);
  console.log(ActiveComponent)

  const changePage = (page)=>{
    console.log(page)
    setActive(page)

  }

  return (
    <div className="flex h-screen">
      {/* Sidebar Component */}
      <Sidebar menuItems={menuItems} changePage = {changePage} />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white shadow-md m-4 rounded-lg">
        <ActiveComponent />
      </main>
    </div>
  );
}
