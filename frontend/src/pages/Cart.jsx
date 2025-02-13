import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";

const CartPage = () => {
  const { cartItems, cartCount, getCart, updateCart, currency, getTotalPrice } =
    useContext(ShopContext);

  const navigate = useNavigate();

  useEffect(() => {
    getCart();
  }, []);

  const handleQuantityChange = (item, quantity) => {
    if (quantity < 0) return;
    updateCart(item.itemId, item.length, item.breadth, item.height, quantity);
  };

  const handleRemoveItem = (item) => {
    updateCart(item.itemId, item.length, item.breadth, item.height, 0);
    toast.info("Item removed from cart");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Cart Items</h2>

      {cartCount === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => {
              const key = `${item.itemId}-${item.length}-${item.breadth}-${item.height}`;

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  {/* Placeholder for product image */}
                  <div className="w-20 h-20 bg-gray-200">
                    <img src={item.product?.image} alt={item.product?.name} />
                  </div>

                  {/* Product details */}
                  <div className="flex-1 px-4">
                    <h3 className="font-bold">
                      {item.product?.name || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Category: {item.product?.category || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      WoodType: {item.product?.wood || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Length: {item.length}cm | Breadth: {item.breadth}cm |
                      Height: {item.height}cm
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-semibold">
                    {currency}
                    {item.product?.price * item.quantity}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border rounded">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove item */}
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="ml-2 text-red-500"
                  >
                    <FiTrash size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Total Price & Checkout */}
          <div className="mt-6 text-right border-t pt-4">
            <p className="text-lg font-semibold">
              Total Cost: {currency}
              {getTotalPrice()}
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-2 px-6 py-2 bg-gray-500 text-white rounded"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
