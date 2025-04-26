import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
// import mongoose from "mongoose";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    product,
    cartItems,
    setCartItems,
    delivery_fee,
    getTotalPrice,
    partialPayment,
    fetchProductData,
  } = useContext(ShopContext);

  const [Method, setMethod] = useState("online");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    province: "",
    zipcode: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const storeOrderId = (orderId) => {
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    localStorage.setItem("orderId", orderId);
    localStorage.setItem("expiryTime", expiryTime.toString());
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      console.log("PRODUCTS:", product); // Logs the product state
      console.log("Cart Items in PlaceOrder Page", cartItems); // Logs the cart items

      const orderItems = await Promise.all(
        cartItems.map(async (item) => {
          console.log("Item ID:", item.itemId);

          // Fetch product data for each item in the cart by itemId
          const productData = await fetchProductData(item.itemId);

          console.log("Product Data:", productData);

          if (productData) {
            return {
              _id: productData._id,
              name: productData.name,
              category: productData.category,
              wood: productData.wood,
              image: Array.isArray(productData.image)
                ? productData.image[0]
                : productData.image,
              length: item.length,
              breadth: item.breadth,
              height: item.height,
              quantity: item.quantity,
            };
          }
          return null;
        })
      );

      // Filter out null values from orderItems
      const validOrderItems = orderItems.filter((item) => item !== null);

      console.log("Order Items after mapping:", validOrderItems);

      const totalAmount = getTotalPrice() + delivery_fee;
      if (isNaN(totalAmount) || totalAmount <= 0) {
        console.error("Invalid amount:", totalAmount);
        return; // Stop execution if amount is invalid
      }

      let orderData = {
        items: orderItems,
        address: formData,
        amount: totalAmount,
      };

      console.log("Order Data:", orderData);

      const response = await axios.post(
        `${backendUrl}/api/order/physical`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCartItems([]);
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order placement error:", error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-wrap gap-10">
      {/* Left Side */}
      <div className="flex-1 space-y-6">
        <div>
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="px-3 py-2 border border-gray-300 rounded-lg w-full"
            type="text"
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            placeholder="First Name"
            required
          />
          <input
            className="px-3 py-2 border border-gray-300 rounded-lg w-full"
            type="text"
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            placeholder="Last Name"
            required
          />
        </div>

        <input
          className="px-3 py-2 border border-gray-300 rounded-lg w-full"
          type="email"
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          placeholder="E-mail"
          required
        />
        <input
          className="px-3 py-2 border border-gray-300 rounded-lg w-full"
          type="text"
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          placeholder="Phone Number"
          required
        />

        <input
          className="px-3 py-2 border border-gray-300 rounded-lg w-full"
          type="text"
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          placeholder="Street Address"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="px-3 py-2 border border-gray-300 rounded-lg w-full"
            type="text"
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            placeholder="City"
            required
          />
          <input
            className="px-3 py-2 border border-gray-300 rounded-lg w-full"
            type="text"
            onChange={onChangeHandler}
            name="province"
            value={formData.province}
            placeholder="Province"
            required
          />
        </div>

        <input
          className="px-3 py-2 border border-gray-300 rounded-lg w-full"
          type="text"
          onChange={onChangeHandler}
          name="zipcode"
          value={formData.zipcode}
          placeholder="Zip Code"
          required
        />
      </div>
      {/* Right Side */}
      <div className="flex-1 space-y-6">
        <div>
          <CartTotal />
        </div>
        <div className="w-full text-end mt-8">
          <p className="text-base font-semibold text-blue-600">
            Note: COD requires pre payment of 20%
          </p>
          <button
            type="submit"
            className="bg-black text-white px-16 py-3 text-sm"
          >
            ADD TO ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
