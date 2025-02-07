import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";

const Navbar = () => {
  const { token, setToken, navigate } = useContext(AdminContext);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 ">
      <img
        className="w-24 sm:w-32 md:w-40 lg:w-48"
        src={assets.logo}
        alt="Logo"
      />
      <div className="flex flex-row gap-2">
        <button className="hover:underline">Frontend Page</button>
        <button
          className="border px-4 py-2 sm:px-6 sm:py-2 md:px-4 md:py-2 rounded-full bg-slate-900 text-white text-sm sm:text-base md:text-lg hover:bg-slate-600 transition-colors"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
