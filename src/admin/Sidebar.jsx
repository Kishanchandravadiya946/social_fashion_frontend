import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ menuItems,changePage  }) {
  const location = useLocation();
  const [active,setactive]=  useState("Home");

  return (
    <aside className="w-72 bg-gray-900 text-white p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
           onClick={()=>
            {
            changePage(item.name)
            setactive(item.name)
            }
           }
            key={item.name}
            
            className={`flex items-center gap-3 p-2 rounded-lg w-full text-left transition ${
                active === item.name ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-lg">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
