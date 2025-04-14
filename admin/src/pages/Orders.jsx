import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Orders = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);

  const allOrders = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    allOrders();
  }, [token]);

  const updateOrderLocally = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  };

  const statusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        updateOrderLocally(response.data.order);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update order status";
      toast.error(errorMsg);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/cancel`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        updateOrderLocally(response.data.order);
      }
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  const updatePayment = async (orderId, payment) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/payment`,
        { orderId, payment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Payment updated successfully.");
        updateOrderLocally(response.data.order);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update payment.";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">All Orders</h1>
      <div className="flex flex-col gap-4">
        {orders
          .filter((order) => order && order._id)
          .map((order) => {
            const isPaid = order.payment === order.amount;
            const remaining = order.amount - order.payment;

            return (
              <div
                key={order._id}
                className="flex flex-col gap-3 border p-4 shadow-md rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Order ID: {order._id}</p>
                  <div className="flex gap-2">
                    {order.status !== "cancelled" &&
                      order.status !== "delivered" && (
                        <>
                          <div className="relative group">
                            <button
                              onClick={() => {
                                let nextStatus = "";
                                if (order.status === "pending")
                                  nextStatus = "processing";
                                else if (order.status === "processing")
                                  nextStatus = "delivered";

                                if (
                                  nextStatus === "delivered" &&
                                  order.paymentStatus.toLowerCase() ===
                                    "pending"
                                )
                                  return;

                                statusUpdate(order._id, nextStatus);
                              }}
                              className={`px-3 py-1 rounded text-white ${
                                order.status === "processing" &&
                                order.paymentStatus.toLowerCase() === "pending"
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-500 hover:bg-blue-600"
                              }`}
                              disabled={
                                order.status === "processing" &&
                                order.paymentStatus.toLowerCase() === "pending"
                              }
                            >
                              {order.status === "pending"
                                ? "Mark as Processing"
                                : order.status === "processing"
                                ? "Mark as Delivered"
                                : ""}
                            </button>

                            {order.status === "processing" &&
                              order.paymentStatus.toLowerCase() ===
                                "pending" && (
                                <div className="absolute top-full left-0 mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shadow-md z-10 whitespace-nowrap">
                                  Cannot mark as delivered. Payment is pending.
                                </div>
                              )}
                          </div>

                          <button
                            onClick={() => cancelOrder(order._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Reject Order
                          </button>
                        </>
                      )}
                  </div>
                </div>

                <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
                <p>
                  Status: <span className="capitalize">{order.status}</span>
                </p>
                <p>
                  Payment Status:{" "}
                  <span
                    className={`${
                      order.paymentStatus.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : order.paymentStatus.toLowerCase() === "partial"
                        ? "text-orange-500"
                        : "text-green-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
                <p>
                  Paid: ${Number(order.payment || 0).toFixed(2)} / $
                  {Number(order.amount).toFixed(2)}
                </p>
                {remaining > 0 && (
                  <p className="text-sm text-red-600">
                    Remaining: ${remaining.toFixed(2)}
                  </p>
                )}
                <p className="font-semibold text-lg">
                  Total: ${Number(order.amount || 0).toFixed(2)}
                </p>

                {/* Admin payment input */}
                {order.status === "cancelled" ? (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    Order Cancelled
                  </p>
                ) : remaining > 0 ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={remaining}
                      placeholder={`Remaining: $${remaining.toFixed(2)}`}
                      className="border px-2 py-1 rounded w-32 text-sm"
                      value={order.updatedPayment || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setOrders((prevOrders) =>
                          prevOrders.map((o) =>
                            o._id === order._id
                              ? { ...o, updatedPayment: value }
                              : o
                          )
                        );
                      }}
                    />
                    <button
                      onClick={() => {
                        const payment = order.updatedPayment;
                        if (payment > remaining) {
                          toast.error("Payment cannot exceed remaining amount");
                          return;
                        }
                        updatePayment(order._id, payment);
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Update Payment
                    </button>
                  </div>
                ) : (
                  <p className="text-green-600 text-sm mt-1 font-medium">
                    Payment complete
                  </p>
                )}

                {/* Address Info */}
                <div className="text-sm text-gray-700">
                  <p>
                    Customer: {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>Email: {order.address.email}</p>
                  <p>Phone: {order.address.phone}</p>
                  <p>
                    Address: {order.address.street}, {order.address.city},{" "}
                    {order.address.province} {order.address.zipcode}
                  </p>
                </div>

                {/* Items */}
                <div className="flex overflow-x-auto gap-4 pt-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="min-w-[200px] flex-shrink-0 border rounded-lg p-2 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded"
                      />
                      <p className="font-semibold mt-2">{item.description}</p>
                      <p className="text-sm">Wood: {item.wood}</p>
                      <p className="text-sm">
                        Size: {item.length}x{item.breadth}x{item.height}
                      </p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Orders;
