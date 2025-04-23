import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaList,
  FaUsers,
  FaComments,
  FaHistory,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        {/* Home */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive
                ? "bg-amber-100 text-amber-900 font-medium"
                : "hover:bg-gray-100"
            }`
          }
          to="/home"
        >
          <FaHome className="w-5 h-5" />
          <p className="hidden md:block">Home</p>
        </NavLink>

        {/* Add Items */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive
                ? "bg-amber-100 text-amber-900 font-medium"
                : "hover:bg-gray-100"
            }`
          }
          to="/add"
        >
          <FaPlus className="w-5 h-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        {/* List Items */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive
                ? "bg-amber-100 text-amber-900 font-medium"
                : "hover:bg-gray-100"
            }`
          }
          to="/list"
        >
          <FaList className="w-5 h-5" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        {/* List Users */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive
                ? "bg-amber-100 text-amber-900 font-medium"
                : "hover:bg-gray-100"
            }`
          }
          to="/listuser"
        >
          <FaUsers className="w-5 h-5" />
          <p className="hidden md:block">List User</p>
        </NavLink>

        {/* Chat Box */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive
                ? "bg-amber-100 text-amber-900 font-medium"
                : "hover:bg-gray-100"
            }`
          }
          to="/chatbox"
        >
          <FaComments className="w-5 h-5" />
          <p className="hidden md:block">Chat Box</p>
        </NavLink>

        {/* Order History */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive
                ? "bg-amber-100 text-amber-900 font-medium"
                : "hover:bg-gray-100"
            }`
          }
          to="/orders"
        >
          <FaHistory className="w-5 h-5" />
          <p className="hidden md:block">Order History</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
