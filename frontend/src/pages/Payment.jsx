import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const Payment = () => {
  const location = useLocation();
  const { amount, orderId } = location.state || {};

  // Add signed fields
  const signedFields = "total_amount,transaction_uuid,product_code";

  const [formData, setFormData] = useState({
    amount: amount || "",
    tax_amount: "0",
    total_amount: amount || "",
    transaction_uuid: "", // We'll set this dynamically later
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/payment-success",
    failure_url: "http://localhost:5173/payment-failure",
    signed_field_names: signedFields,
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  const generateSignature = (data) => {
    const { total_amount, transaction_uuid, product_code, secret } = data;
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  useEffect(() => {
    if (!amount || !orderId) return;

    // Combine uuidv4() with orderId to generate transaction_uuid
    const transactionUuid = uuidv4() + orderId;

    const updatedFormData = {
      ...formData,
      amount,
      total_amount: amount,
      transaction_uuid: transactionUuid,
    };

    const signature = generateSignature(updatedFormData);

    setFormData({
      ...updatedFormData,
      signature,
    });
  }, [amount, orderId]);

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4 mt-10"
    >
      <h1 className="text-center text-xl font-semibold text-gray-700">
        Confirm Your Payment
      </h1>

      <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
        <p>
          <strong>Order ID:</strong> {orderId}
        </p>
        <p>
          <strong>Amount:</strong> Rs. {formData.total_amount}
        </p>
      </div>

      <input type="hidden" name="amount" value={formData.amount} />
      <input type="hidden" name="tax_amount" value={formData.tax_amount} />
      <input type="hidden" name="total_amount" value={formData.total_amount} />
      <input
        type="hidden"
        name="transaction_uuid"
        value={formData.transaction_uuid}
      />
      <input type="hidden" name="product_code" value={formData.product_code} />
      <input
        type="hidden"
        name="product_service_charge"
        value={formData.product_service_charge}
      />
      <input
        type="hidden"
        name="product_delivery_charge"
        value={formData.product_delivery_charge}
      />
      <input type="hidden" name="success_url" value={formData.success_url} />
      <input type="hidden" name="failure_url" value={formData.failure_url} />
      <input
        type="hidden"
        name="signed_field_names"
        value={formData.signed_field_names}
      />
      <input type="hidden" name="signature" value={formData.signature} />

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
