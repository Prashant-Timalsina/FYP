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
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]); // Ensure it's an array

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [wood, setWood] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // const fetchProductData = async (productId) => {
  //   try {
  //     const response = await axios.get(
  //       `${backendUrl}/api/product/single/${productId}`
  //     );
  //     if (response.data.success) {
  //       const productData = response.data.product;
  //       setProduct(productData);

  //       if (productData.category || productData.wood) {
  //         if (productData.category) {
  //           // console.log("Fetching category data for ID:", productData.category);
  //           fetchCategory(productData.category);
  //         }
  //         if (productData.wood) {
  //           // console.log("Fetching wood data for ID:", productData.wood);
  //           fetchWood(productData.wood);
  //         }
  //       }
  //     } else {
  //       console.error("Error fetching product:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching product:", error);
  //   }
  // };

  const fetchProductData = async (productId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/single/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const productData = response.data.product;

        // Fetch category and wood
        const categoryName = productData.category
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

  // const fetchCategory = async (categoryId) => {
  //   try {
  //     const response = await axios.get(
  //       `${backendUrl}/api/category/single/${categoryId}`
  //     );
  //     if (response.data.success) {
  //       setCategory(response.data.category.name);
  //     } else {
  //       console.error("Error fetching category:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching category:", error);
  //   }
  // };

  // const fetchWood = async (woodId) => {
  //   try {
  //     const response = await axios.get(
  //       `${backendUrl}/api/wood/single/${woodId}`
  //     );

  //     if (response.data.success) {
  //       setWood(response.data.wood.name);
  //     } else {
  //       console.error("Error fetching wood:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching wood:", error);
  //   }
  // };

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
        toast.success("Item added to cart");
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
        toast.success("Cart updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  // const getCart = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       return;
  //     }

  //     const cartResponse = await axios.get(`${backendUrl}/api/cart/get`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (cartResponse.data.success) {
  //       const cartData = cartResponse.data.cartData;
  //       const updatedCartData = await Promise.all(
  //         cartData.map(async (item) => {
  //           const productData = await fetchProductData(item.itemId);
  //           return {
  //             ...item,
  //             ...productData,
  //           };
  //         })
  //       );
  //       setCartItems(updatedCartData);
  //       setCartCount(getCartCount(updatedCartData)); // ✅ Update cart count
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to fetch cart");
  //   }
  // };

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const cartResponse = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      toast.error(error.response?.data?.message || "Failed to fetch cart");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };
  useEffect(() => {
    getCart();
  }, [token]);

  const value = {
    navigate,

    product,
    category,
    wood,
    fetchProductData,

    cartItems,
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
    cartCount,
    updateCart,
    getCart,
    getTotalPrice,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
