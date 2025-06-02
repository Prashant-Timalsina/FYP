import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const { navigate, showSearch, setShowSearch, cartCount, token, setToken } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // NEW
  const location = useLocation();
  const isCollectionPage = location.pathname === "/collection";

  const logOut = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  let tooltipTimeout;
  const handleMouseEnter = () => {
    if (!isCollectionPage) {
      tooltipTimeout = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout);
    setShowTooltip(false);
  };

  const handleSearchClick = () => {
    if (isCollectionPage) {
      setShowSearch(!showSearch);
    } else {
      navigate("/collection");
    }
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      <ul className="hidden md:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={assets.search}
            className={`w-6 cursor-pointer ${
              !isCollectionPage ? "opacity-50" : ""
            }`}
            alt="Search icon"
            onClick={handleSearchClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {showTooltip && !isCollectionPage && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Search works only on Collection page
            </div>
          )}
        </div>

        <div className="relative">
          <img
            src={assets.profile}
            className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
            alt="Profile icon"
            onClick={() => {
              if (token) setVisible((v) => !v);
              else navigate("/login");
            }}
          />
          {token && visible && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 py-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setVisible(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate("/orders");
                  setVisible(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Orders
              </button>
              <hr className="my-1" />
              <button
                onClick={() => {
                  setShowLogoutConfirm(true); // Show confirmation popup
                  setVisible(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
          {/* Logout Confirmation Popup */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white rounded shadow-lg p-6 w-80">
                <p className="mb-4 text-gray-800 text-center">
                  Are you sure you want to log out?
                </p>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => {
                      logOut();
                      setShowLogoutConfirm(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    No
                  </button>
                </div>
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
            {cartCount}
          </p>
        </Link>

        <img
          className="w-5 cursor-pointer md:hidden"
          onClick={() => setMenuVisible(!menuVisible)}
          src={assets.menu}
          alt="Menu icon"
        />
      </div>

      {/* Sidebar for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white transition-all duration-300 overflow-hidden z-50 md:hidden ${
          menuVisible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-800 h-full">
          <div
            className="flex items-center gap-4 p-3 cursor-pointer"
            onClick={() => setMenuVisible(false)}
          >
            <img className="h-5" src={assets.back} alt="Back button" />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setMenuVisible(false)}
            className="py-2 px-6 border-t"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setMenuVisible(false)}
            className="py-2 px-6 border-t"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setMenuVisible(false)}
            className="py-2 px-6 border-t"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setMenuVisible(false)}
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
