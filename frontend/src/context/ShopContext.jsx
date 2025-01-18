import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Deep clone utility (for environments without `structuredClone`)
  const deepClone = (data) => {
    return JSON.parse(JSON.stringify(data));
  };

  const value = {
    navigate,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    token,
    setToken,
    currency,
    delivery_fee,
    backendUrl,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
