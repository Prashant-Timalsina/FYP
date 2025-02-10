import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");

  const [cartItems, setCartItems] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Deep clone utility (for environments without `structuredClone`)
  const deepClone = (data) => {
    return JSON.parse(JSON.stringify(data));
  };

  const addToCart = async (itemId, length, breadth, height) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to add items to the cart");
        return;
      }

      const cartResponse = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, length, breadth, height },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (cartResponse.data.success) {
        setCartItems((prevCart) => [
          ...prevCart,
          { itemId, length, breadth, height, quantity: 1 },
        ]);
        toast.success("Item added to cart");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  const getCartCount = () => {
    let totalCount = 0;

    cartItems.forEach((item) => {
      totalCount += item.quantity;
    });

    return totalCount;
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
    addToCart,
    getCartCount,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
