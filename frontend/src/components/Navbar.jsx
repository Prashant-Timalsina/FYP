import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js"; // Adjust the path based on your folder structure

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 " hidden />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 " hidden />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 " hidden />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          src={assets.search}
          className="w-6 cursor-pointer"
          alt="Search icon"
        />
        <div className="relative">
          <img
            src={assets.profile}
            className="w-6 cursor-pointer"
            alt="Profile icon"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          />

          {dropdownVisible && (
            <div className="absolute right-0 pt-3">
              <div className="flex flex-col px-5 gap-2 w-32 bg-slate-200 rounded">
                <p className="cursor-pointer hover:underline ">My Profile</p>
                <p
                  className="cursor-pointer hover:underline "
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </p>
                <p onClick={logOut} className="cursor-pointer hover:underline ">
                  Log Out
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img
            src={assets.cart}
            className="w-6 cursor-pointer"
            alt="Cart icon"
          />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-xs">
            10
          </p>
        </Link>

        <img
          className="w-5 cursor-pointer sm:hidden"
          onClick={() => setVisible(true)}
          src={assets.menu}
          alt="Menu icon"
        />
      </div>

      {/* Sidebar for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white transition-all duration-300 overflow-hidden z-50 sm:hidden ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-800 h-full">
          <div
            className="flex items-center gap-4 p-3 cursor-pointer"
            onClick={() => setVisible(false)}
          >
            <img className="h-5" src={assets.back} alt="Back button" />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 px-6 border-t"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 px-6 border-t"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 px-6 border-t"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 px-6 border-t"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
