// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import { X } from "lucide-react";

// const Searchbar = () => {
//   const { search, setSearch, showSearch, setShowSearch } =
//     useContext(ShopContext);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (showSearch) {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//   }, [showSearch]);

//   return showSearch && visible ? (
//     <div
//       className={`border-t border-b bg-gray-50 text-center transition-opacity duration-300 ease-in-out ${
//         visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
//       }`}
//     >
//       <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 outline-none bg-inherit text-sm"
//           placeholder="Search"
//           type="text"
//         />
//         <img className="w-4" src={assets.search} alt="Search icon" />
//       </div>
//       <X
//         className="inline w-10 cursor-pointer"
//         onClick={() => setShowSearch(false)}
//       />
//     </div>
//   ) : null;
// };

// export default Searchbar;

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const Searchbar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [showSearch]);

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          placeholder="Search"
          type="text"
        />
        <img className="w-4" src={assets.search} alt="Search icon" />
      </div>
      <X
        className="inline w-10 cursor-pointer"
        onClick={() => setShowSearch(false)}
      />
    </motion.div>
  ) : null;
};

export default Searchbar;
