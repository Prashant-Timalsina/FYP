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
    <div className="w-60 min-h-full bg-white border-r-2 rounded-2xl shadow-lg flex flex-col py-8 px-4 gap-4 sticky top-0">
      <div className="flex flex-col gap-2 text-[15px]">
        {/* Home */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/home"
        >
          <FaHome className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        {/* Add Items */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/add"
        >
          <FaPlus className="w-5 h-5" />
          <span>Add Items</span>
        </NavLink>

        {/* List Items */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/list"
        >
          <FaList className="w-5 h-5" />
          <span>List Items</span>
        </NavLink>

        {/* List Users */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/listuser"
        >
          <FaUsers className="w-5 h-5" />
          <span>List User</span>
        </NavLink>

        {/* Chat Box */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/chatbox"
        >
          <FaComments className="w-5 h-5" />
          <span>Chat Box</span>
        </NavLink>

        {/* Order History */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 ${
              isActive ? "bg-amber-100 text-amber-900" : ""
            }`
          }
          to="/orders"
        >
          <FaHistory className="w-5 h-5" />
          <span>Order History</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
