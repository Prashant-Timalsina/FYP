import React, { useEffect, useState, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const dataQuery = search.get("data");
  const [data, setData] = useState({});
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(ShopContext);
  const receiptRef = useRef();

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

  const handleDownloadPdf = () => {
    if (!orderDetails) return;

    const input = receiptRef.current;
    const visibleWidth = input.offsetWidth;
    const visibleHeight = input.offsetHeight;
    const scaleFactor = 0.5;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdfWidth = visibleWidth * scaleFactor;
        const pdfHeight = visibleHeight * scaleFactor;

        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "px",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        pdf.save(`TimberCraft-${timestamp}.pdf`);
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full space-y-8">
        <div ref={receiptRef} className="p-6 border rounded-lg bg-slate-50">
          {" "}
          {/* Added ref and some padding */}
          <div className="text-center mb-6">
            <img
              src="/src/assets/check.png" // Assuming check.png is in public or accessible path
              alt="Success"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Payment Successful
            </h1>
            <p className="text-gray-700">Thank you for your purchase!</p>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Transaction Details
              </h2>
              <p className="text-gray-700">
                <span className="font-medium">Order ID:</span> {data.orderId}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">
                  Amount Paid (This Transaction):
                </span>{" "}
                Rs. {data.total_amount}
              </p>
            </div>

            {orderDetails && (
              <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Order Summary
                </h2>
                <p className="text-gray-700">
                  <span className="font-medium">Total Order Amount:</span> Rs.{" "}
                  {orderDetails.amount.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">
                    Total Paid (All Transactions):
                  </span>{" "}
                  Rs. {orderDetails.payment.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Remaining Amount:</span> Rs.{" "}
                  {(orderDetails.amount - orderDetails.payment).toFixed(2)}
                </p>

                {/* Placeholder for Order Item Details */}
                {/* We can expand this later if needed */}
                {/* <div className="mt-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-1">Items:</h3>
                  {orderDetails.items && orderDetails.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      - {item.name} (Qty: {item.quantity})
                    </div>
                  ))}
                </div> */}
              </div>
            )}
          </div>
        </div>{" "}
        {/* End of receiptRef div */}
        <div className="mt-6 flex flex-col space-y-3">
          {orderDetails && (
            <button
              onClick={handleDownloadPdf}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out shadow-md"
            >
              Download Receipt (PDF)
            </button>
          )}
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out shadow-md"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
