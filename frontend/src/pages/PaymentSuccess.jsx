import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const dataQuery = search.get("data");
  const [data, setData] = useState({});
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const resData = atob(dataQuery);
    const resObject = JSON.parse(resData);
    console.log("Payment Response:", resObject);

    // Extract orderId from transaction_uuid
    const transactionUuid = resObject.transaction_uuid;
    const orderId = transactionUuid.slice(36); // UUID is 36 characters long

    setData({
      ...resObject,
      orderId,
    });

    // Update order payment
    const updatePayment = async () => {
      try {
        // First fetch the current order data
        const orderResponse = await axios.get(
          `${backendUrl}/api/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!orderResponse.data.success) {
          throw new Error("Failed to fetch order data");
        }

        const currentOrder = orderResponse.data.order;
        console.log("Current Order:", currentOrder);

        const currentPayment = currentOrder.payment || 0;
        const newPaymentAmount = parseFloat(resObject.total_amount);
        const newTotalPayment = currentPayment + newPaymentAmount;

        console.log("Payment Details:", {
          currentPayment,
          newPaymentAmount,
          newTotalPayment,
        });

        // Now update with the new total payment
        const updateResponse = await axios.put(
          `${backendUrl}/api/order/payment`,
          {
            orderId,
            payment: newTotalPayment,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Update Response:", updateResponse.data);

        if (!updateResponse.data.success) {
          throw new Error("Failed to update payment");
        }

        // Fetch the updated order details
        const updatedOrderResponse = await axios.get(
          `${backendUrl}/api/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (updatedOrderResponse.data.success) {
          console.log("Updated Order:", updatedOrderResponse.data.order);
          setOrderDetails(updatedOrderResponse.data.order);
        } else {
          throw new Error("Failed to fetch updated order");
        }
      } catch (error) {
        console.error("Error updating payment:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      }
    };

    updatePayment();
  }, [search, token, backendUrl, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <img
            src="src/check.png"
            alt="Success"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-semibold text-green-600 mb-2">
            Payment Successful
          </h1>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600">
              <span className="font-medium">Order ID:</span> {data.orderId}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Amount Paid:</span> Rs.{" "}
              {data.total_amount}
            </p>
          </div>

          {orderDetails && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">
                <span className="font-medium">Total Order Amount:</span> Rs.{" "}
                {orderDetails.amount}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Total Paid:</span> Rs.{" "}
                {orderDetails.payment}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Remaining Amount:</span> Rs.{" "}
                {(orderDetails.amount - orderDetails.payment).toFixed(2)}
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
