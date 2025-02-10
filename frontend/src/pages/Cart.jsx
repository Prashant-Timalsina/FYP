import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    navigate,
    updateQuantity,
    removeFromCart,
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const itemVariant in cartItems[itemId]) {
        const quantity = cartItems[itemId][itemVariant];
        const { name, price } = products.find(
          (product) => product._id === itemId
        );
        tempData.push({
          itemId,
          itemVariant,
          name,
          price,
          quantity,
        });
      }
    }
    setCartData(tempData);
  }, [cartItems, products]);

  const handleQuantityChange = (itemId, itemVariant, value) => {
    const quantity = Number(value);
    if (!quantity || quantity <= 0) {
      return;
    }
    updateQuantity(itemId, itemVariant, quantity);
  };

  // Render cart items
  const renderCartItems = () => {
    if (cartData.length === 0) {
      return (
        <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
      );
    }

    return cartData.map((item, index) => {
      const productData = products.find(
        (product) => product._id === item.itemId
      );

      if (!productData) {
        console.error("Product not found for item:", item.itemId);
        return null;
      }

      return (
        <div
          key={index}
          className="flex items-center justify-between border-b-2 py-4"
        >
          <div className="flex gap-4">
            <img
              // src={productData.images[0].filepath}
              src={productData.images[0]}
              alt={productData.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h2 className="font-medium">{productData.name}</h2>
              <p className="text-gray-500">
                {item.itemVariant} - {item.quantity} x {currency}
                {item.price}
              </p>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.itemId, item.itemVariant)}
            className="text-red-500 font-medium"
          >
            Remove
          </button>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      {renderCartItems()}
    </div>
  );
};

export default Cart;
