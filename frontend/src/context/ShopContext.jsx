import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../api";
import { Backpack } from "lucide-react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "NRs.";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const frontendUrl = import.meta.env.FRONTEND_URL;

  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]); // Ensure it's an array

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [woods, setWoods] = useState([]);

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [wood, setWood] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  const fetchallProducts = async (page = 1, keyword = "") => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        params: { page, limit: 10, keyword }, // Pass page, limit, and keyword
      });

      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages); // Update total pages
        return response.data;
      } else {
        console.error("Error fetching products:", response.data.message);
        toast.error("Failed to fetch products");
        return { products: [], totalPages: 1 }; // Fallback in case of error
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
      return { products: [], totalPages: 1 }; // Fallback in case of error
    }
  };

  const fetchallCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/all`);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.error("Error fetching categories:", response.data.message);

        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchallWoods = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/wood/all`);
      if (response.data.success) {
        setWoods(response.data.woods);
      } else {
        console.error("Error fetching woods:", response.data.message);
        toast.error("Failed to fetch woods");
      }
    } catch (error) {
      console.error("Error fetching woods:", error);
      toast.error("Failed to fetch woods");
    }
  };

  useEffect(() => {
    fetchallProducts(currentPage);
  }, [currentPage]);

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchallCategories();
    fetchallWoods();
  }, []);

  const fetchProductData = async (productId) => {
    try {
      // const response = await axios.get(
      //   `${backendUrl}/api/product/single/${productId}`,
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      const response = await axios.get(
        `${backendUrl}/api/product/single/${productId}`
      );
      if (response.data.success) {
        const productData = response.data.product;

        // Fetch category and wood
        const category = productData.category
          ? await fetchCategory(productData.category)
          : "Unknown Category";

        const woodName = productData.wood
          ? await fetchWood(productData.wood)
          : "Unknown Wood";

        const fullProductData = {
          ...productData,
          category,
          wood: woodName,
        };
        setProduct(fullProductData);
        return fullProductData;
      }

      console.error("Error fetching product:", response.data.message);
    } catch (error) {
      toast.error("Failed to fetch product data");
      console.error("Error fetching product:", error);
    }
    return null;
  };

  const fetchCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/category/single/${categoryId}`
      );
      setCategory(
        response.data.success ? response.data.category.name : "Unknown Category"
      );
      return response.data.success
        ? response.data.category.name
        : "Unknown Category";
    } catch (error) {
      toast.error("Failed to fetch category data");
      console.error("Error fetching category:", error);
      return "Unknown Category";
    }
  };

  const fetchWood = async (woodId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/wood/single/${woodId}`
      );
      setWood(response.data.success ? response.data.wood.name : "Unknown Wood");
      return response.data.success ? response.data.wood.name : "Unknown Wood";
    } catch (error) {
      toast.error("Failed to fetch wood data");
      console.error("Error fetching wood:", error);
      return "Unknown Wood";
    }
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
        setCartItems((prevCart) => {
          const existingItemIndex = prevCart.findIndex(
            (item) =>
              item.itemId === itemId &&
              item.length === length &&
              item.breadth === breadth &&
              item.height === height
          );

          if (existingItemIndex !== -1) {
            // ✅ FIX: Increase quantity if item exists
            const updatedCart = [...prevCart];
            updatedCart[existingItemIndex].quantity += 1;
            return updatedCart;
          }

          return [
            ...prevCart,
            { itemId, length, breadth, height, quantity: 1 },
          ];
        });

        setCartCount((prevCount) => prevCount + 1); // ✅ FIX: Update cart count
        // toast.success("Item added to cart");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const getCartCount = (cartData) => {
    return cartData?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const updateCart = async (itemId, length, breadth, height, quantity) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to update the cart");
        return;
      }

      const updateResponse = await axios.put(
        `${backendUrl}/api/cart/update`,
        { itemId, length, breadth, height, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (updateResponse.data.success) {
        setCartItems((prevCart) => {
          const updatedCart = deepClone(prevCart);
          const itemIndex = updatedCart.findIndex(
            (item) =>
              item.itemId === itemId &&
              item.length === length &&
              item.breadth === breadth &&
              item.height === height
          );

          if (itemIndex !== -1) {
            if (quantity === 0) {
              updatedCart.splice(itemIndex, 1);
            } else {
              updatedCart[itemIndex].quantity = quantity;
            }
          }

          return updatedCart;
        });
        setCartCount(getCartCount(cartItems)); // ✅ Update cart count
        // toast.success("Cart updated");
        getCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  const getCart = async () => {
    try {
      if (!token) return;

      const cartResponse = await api.get(`/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // const cartResponse = await axios.get(`${backendUrl}/api/cart/get`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      if (cartResponse.data.success) {
        const cartData = cartResponse.data.cartData;

        const updatedCartData = await Promise.all(
          cartData.map(async (item) => {
            const productData = await fetchProductData(item.itemId);
            return productData
              ? { ...item, product: productData }
              : { ...item, product: { name: "Unknown Product", price: 0 } };
          })
        );

        setCartItems(updatedCartData);
        setCartCount(getCartCount(updatedCartData));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // toast.error(error.response?.data?.message || "Failed to fetch cart");
    }
  };

  const cleanCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const cartResponse = await axios.delete(`${backendUrl}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (cartResponse.data.success) {
        setCartItems([]);
        setCartCount(0);
        toast.success("Cart cleared");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0; // Ensure price is always defined
      return total + price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    getCart();
  }, [token]);

  // const partialPayment = 0.2 * getTotalPrice();
  const partialPayment = parseFloat((0.2 * getTotalPrice()).toFixed(2));

  useEffect(() => {
    if (token) {
      getFavorites();
    }
  }, [token]);

  const addToFavorites = async (productId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/fav/add/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(response.data.favorites);
      // toast.success("Added to favorites");
    } catch (error) {
      console.error(
        "Error adding to favorites:",
        error.response?.data?.message
      );
      toast.error("Failed to add to favorites");
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/fav/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(response.data.favorites);
      // toast.success("Removed from favorites");
    } catch (error) {
      console.error(
        "Error removing from favorites:",
        error.response?.data?.message
      );
      toast.error("Failed to remove from favorites");
    }
  };

  const getFavorites = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/fav`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error.response?.data?.message);
      toast.error("Failed to fetch favorites");
    }
  };

  const value = {
    navigate,
    changePage,
    currentPage,
    totalPages,

    products,
    categories,
    woods,

    product,
    category,
    wood,
    fetchProductData,
    fetchallProducts,
    // fetchRelatedProducts,

    cartItems,
    setCartItems,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    token,
    setToken,

    currency,
    delivery_fee,
    backendUrl,
    frontendUrl,

    addToCart,
    cartCount,
    updateCart,
    getCart,
    cleanCart,

    getTotalPrice,
    partialPayment,

    favorites,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
