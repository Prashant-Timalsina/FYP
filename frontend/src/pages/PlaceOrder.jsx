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
      // Map through the cartItems and get corresponding product data
      const orderItems = cartItems
        .map((item) => {
          // Assuming product is a single product object
          const productData = Array.isArray(product)
            ? product.find((p) => p._id === item.id)
            : product; // If products is not an array, use it directly

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
        .filter((item) => item !== null); // Filter out null values if any product was not found

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

      switch (Method) {
        case "physical":
          const physicalResponse = await axios.post(
            `${backendUrl}/api/order/physical`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Token being sent:", token);

          if (physicalResponse.data.success) {
            setCartItems([]);
            navigate("/orders");
          }
          break;

        case "online":
          const onlineResponse = await axios.post(
            `${backendUrl}/api/order/online`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (onlineResponse.data.success) {
            const { orderId } = onlineResponse.data;
            console.log("Order ID:", orderId);

            storeOrderId(orderId);

            const paymentData = {
              amount: totalAmount,
              // orderId,
              // success_url: `http://localhost:5173/success-payment?orderId=${orderId}`,
              // failure_url: `http://localhost:5173/failure-payment?orderId=${orderId}`,
              orderId,
              success_url: `http://localhost:5173/success-payment`,
              failure_url: `http://localhost:5173/failure-payment`,
            };
            navigate("/payment", { state: paymentData });
          }
          break;

        case "cod":
          const partialResponse = await axios.post(
            `${backendUrl}/api/order/online`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (partialResponse.data.success) {
            const paymentData = {
              amount: partialPayment,
              success_url: "http://localhost:5173/success-payment",
              failure_url: "http://localhost:5173/failure-payment",
            };
            navigate("/payment", { state: paymentData });
          }
          break;

        default:
          break;
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
        <div>
          <Title text1={"PAYMENT"} text2={"METHOD"} />
        </div>
        <div className="flex flex-col gap-4">
          {[
            {
              id: "physical",
              label: "Physical Deposit",
              desc: "Visit our shop to deposit and confirm your order.",
            },
            {
              id: "cod",
              label: "Cash On Delivery",
              desc: "Requires a deposit payment.",
            },
            {
              id: "online",
              label: "Full Payment",
              desc: "Pay online via E-sewa.",
            },
          ].map(({ id, label, desc }) => (
            <div
              key={id}
              onClick={() => setMethod(id)}
              className={`flex items-center gap-4 p-4 border border-gray-300 rounded-xl cursor-pointer transition ${
                Method === id
                  ? "bg-green-100 border-green-400"
                  : "hover:bg-gray-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center transition ${
                  Method === id ? "bg-green-400 border-green-600" : "bg-white"
                }`}
              >
                {Method === id && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
