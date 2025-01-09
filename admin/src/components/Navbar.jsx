import React from "react";
import { assets } from "../assets/assets";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 ">
      <img
        className="w-24 sm:w-32 md:w-40 lg:w-48"
        src={assets.logo}
        alt="Logo"
      />
      <button
        className="border px-4 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 rounded-full bg-slate-900 text-white text-sm sm:text-base md:text-lg hover:bg-slate-600 transition-colors"
        onClick={() => console.log("logout")}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
