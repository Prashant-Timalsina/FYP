import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom"; // Correct import for useSearchParams
import axios from "axios"; // Make sure axios is imported
import { ShopContext } from "../context/ShopContext";

// Utility function to retrieve orderId from localStorage
const getValidOrderId = () => {
  const orderId = localStorage.getItem("orderId");
  const expiryTime = localStorage.getItem("expiryTime");

  if (!orderId) return null; // No data found

  try {
    // const { orderId, expiryTime } = JSON.parse(orderData);

    // Check if the orderId has expired
    if (Date.now() > expiryTime) {
      console.warn("Stored orderId has expired, removing from localStorage...");
      localStorage.removeItem("orderData");
      return null;
    }

    return orderId;
  } catch (error) {
    console.error("Error parsing orderData:", error);
    localStorage.removeItem("orderData"); // Remove corrupted data
    return null;
  }
};
const PaymentSuccess = () => {
  const { backendUrl } = useContext(ShopContext);
  const [search] = useSearchParams();
  const dataQuery = search.get("data");
  const [data, setData] = useState({});
  const orderId = getValidOrderId();

  useEffect(() => {
    if (dataQuery) {
      try {
        const resData = atob(dataQuery);
        const resObject = JSON.parse(resData);
        console.log(resObject);
        setData(resObject);
      } catch (error) {
        console.error("Error decoding data:", error);
      }
    }
  }, [dataQuery]); // Using `dataQuery` in the dependency array to trigger on change

  useEffect(() => {
    if (data) {
      updateStatus(); // Calling updateStatus when the data is ready
    }
  }, [data]); // Trigger the updateStatus when `data` changes

  const updateStatus = async () => {
    if (!orderId) {
      console.error("No valid orderId found.");
      return;
    }

    const newStatus = data?.status === "COMPLETE" ? "processing" : "pending";

    try {
      const response = await axios.put(
        `${backendUrl}/api/order/status/${orderId}`,
        { status: newStatus }
      );
      console.log("Order status updated successfully:", response.data);
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    updateStatus(); // Calling updateStatus when the data is ready
  }, [data]); // Trigger the updateStatus when `data` changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <img
          src="https://freerangestock.com/sample/50976/tick-success-shows-progress-checkmark-and-correct.jpg"
          alt="Payment success"
          className="w-24 h-24 mx-auto mb-4"
        />
        <p className="text-xl font-semibold mb-2">Payment Successful</p>
        <p className="text-lg font-bold">Amount Paid:</p>
        <p className="text-2xl text-green-600">Rs. {data.total_amount}</p>
      </div>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">
        Go to Homepage
      </Link>
    </div>
  );
};

export default PaymentSuccess;
