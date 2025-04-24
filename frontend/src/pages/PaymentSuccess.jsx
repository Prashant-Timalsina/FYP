import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const dataQuery = search.get("data");
  const [data, setData] = useState({});

  useEffect(() => {
    const resData = atob(dataQuery);
    const resObject = JSON.parse(resData);
    console.log(resObject);

    // Extract orderId from transaction_uuid
    const transactionUuid = resObject.transaction_uuid;
    const orderId = transactionUuid.slice(36); // UUID is 36 characters long

    setData({
      ...resObject,
      orderId, // Add extracted orderId to the state
    });
  }, [search]);

  return (
    <div className="payment-container">
      <img src="src/check.png" alt="" />
      <p className="price">Rs. {data.total_amount}</p>
      <p className="status">Payment Successful</p>
      {/* Display the extracted orderId */}
      <p>
        <strong>Order ID:</strong> {data.orderId}
      </p>
    </div>
  );
};

export default PaymentSuccess;
