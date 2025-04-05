import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";

const Orders = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [statusOptions] = useState(["pending", "processing", "delivered"]); // Valid statuses

  const allOrders = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.orders); // Ensure orders are fetched correctly
      }
    } catch (err) {
      console.log("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    allOrders();
  }, [token]);

  const statusUpdate = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/status/${id}`,
        { status: newStatus }, // Send the new status in the request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        allOrders(); // Refresh orders after status update
      }
    } catch (err) {
      console.log("Error updating status:", err);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">All Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col gap-2 border p-4 shadow-md rounded-lg"
          >
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Order ID: {order._id}</p>
              <select
                className="border px-2 py-1 rounded"
                defaultValue={order.status}
                onChange={(e) => statusUpdate(order._id, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Order Status: {order.status}</p>
            <p>Order Total: ${order.totalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
