import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, amount } = location.state || {}; // fallback safety

  const [formData, setFormData] = useState(null);

  // Redirect to checkout if required data is missing
  useEffect(() => {
    if (!orderId || !amount) {
      navigate("/checkout");
    }
  }, [orderId, amount, navigate]);

  const FullPayment = formData.amount;

  // Step 1: Initiate payment
  useEffect(() => {
    const initiatePayment = async () => {
      console.log("Initiating payment with:", { orderId, amount });

      try {
        const res = await axios.post(
          "http://localhost:4000/api/payment/initiate",
          { orderId, amount }
        );

        console.log("Payment initiation response:", res.data);

        if (res.data.error) {
          throw new Error(res.data.error);
        }

        setFormData({
          amount: amount.toString(),
          tax_amount: "0",
          total_amount: amount.toString(),
          transaction_uuid: res.data.transaction_uuid,
          product_service_charge: "0",
          product_delivery_charge: "0",
          product_code: "EPAYTEST",
          success_url: res.data.success_url,
          failure_url: res.data.failure_url,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature: res.data.signature,
        });
      } catch (err) {
        console.error(
          "Payment initiation error",
          err?.response?.data || err.message
        );
        alert("Payment initiation failed");
        navigate("/checkout");
      }
    };

    initiatePayment();
  }, [amount, orderId, navigate]);

  if (!formData) {
    return <p className="text-center mt-10">Loading payment form...</p>;
  }

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4 mt-10"
    >
      <h1 className="text-center text-xl font-semibold text-gray-700">
        Confirm Your Payment
      </h1>

      {/* Summary */}
      <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
        <p>
          <strong>Order ID:</strong> {orderId}
        </p>
        <p>
          <strong>Amount:</strong> Rs. {amount}
        </p>
      </div>

      {/* Displayed Amount */}
      <div>
        <label className="text-sm text-gray-600">Amount</label>
        <input
          type="text"
          value={FullPayment}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>

      {/* Hidden Fields */}
      {Object.entries(formData).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
      >
        Pay via E-Sewa
      </button>
    </form>
  );
};

export default Payment;
