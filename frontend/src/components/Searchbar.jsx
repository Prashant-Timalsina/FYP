import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { X } from "lucide-react";
import { motion } from "framer-motion";
// import api from "../api";

const Searchbar = () => {
  const { search, setSearch, showSearch, setShowSearch, fetchallProducts } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [showSearch]);

  const handleSearch = async () => {
    fetchallProducts(1, search);
    setShowSearch(false);
  };

  // Handle "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Immediately fetch results on Enter
    }
  };

  return showSearch && visible ? (
    <motion.div
      className="border-t border-b bg-gray-50 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search || ""} // Fallback ensures it's always defined
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none bg-inherit text-sm"
          placeholder="Search"
          type="text"
        />
        <img
          className="w-4 cursor-pointer"
          src={assets.search}
          alt="Search icon"
          onClick={handleSearch}
        />
      </div>
      {loading && <p>Loading...</p>}

      <X
        className="inline w-10 cursor-pointer"
        onClick={() => setShowSearch(false)}
      />
    </motion.div>
  ) : null;
};

export default Searchbar;
