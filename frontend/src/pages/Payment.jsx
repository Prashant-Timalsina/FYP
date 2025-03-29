import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { ShopContext } from "../context/ShopContext";

const Payment = () => {
  const location = useLocation();
  const { orderId, amount, success_url, failure_url } = location.state;
  const { cleanCart } = useContext(ShopContext);

  // Clear cart items
  const clearItems = () => {
    cleanCart();
  };

  const [formData, setFormData] = useState({
    amount: amount.toString(),
    tax_amount: "0",
    total_amount: amount.toString(),
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: success_url,
    failure_url: failure_url,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  // generate signature function
  const generateSignature = (
    total_amount,
    transaction_uuid,
    product_code,
    secret
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    return hashedSignature;
  };

  // useEffect
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = formData;
    const hashedSignature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );

    setFormData({ ...formData, signature: hashedSignature });
  }, [formData.amount]);

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
      className=" max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h1 className="text-center text-xl font-semibold text-gray-700">
        Your Total
      </h1>

      <div className="space-y-1">
        <label htmlFor="amount" className="text-sm font-medium text-gray-600">
          Amount
        </label>
        <input
          type="text"
          id="amount"
          name="amount"
          autoComplete="off"
          value={formData.amount}
          onChange={({ target }) =>
            setFormData({
              ...formData,
              amount: target.value,
              total_amount: target.value,
            })
          }
          readOnly
          required
          className="w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Hidden Fields */}
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
        onClick={clearItems}
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
      >
        Pay via E-Sewa
      </button>
    </form>
  );
};

export default Payment;
