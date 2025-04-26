import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Orders = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
  });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters,
      });

      const response = await axios.get(
        `${backendUrl}/api/order/all?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (err) {
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchOrders(newPage);
  };

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

  const updatePayment = async (orderId, newPayment) => {
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
      const currentPayment = currentOrder.payment || 0;
      const totalPayment = currentPayment + newPayment;

      // Now update with the new total payment
      const updateResponse = await axios.put(
        `${backendUrl}/api/order/payment`,
        {
          orderId,
          payment: totalPayment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (updateResponse.data.success) {
        toast.success("Payment updated successfully.");
        updateOrderLocally(updateResponse.data.order);
      } else {
        throw new Error("Failed to update payment");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update payment.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">All Orders</h1>
            <div className="flex gap-3">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => {
                  const isPaid = order.payment === order.amount;
                  const remaining = order.amount - order.payment;

                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow-sm p-6 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-gray-900">
                          ID: {order._id}
                        </p>
                        <div className="flex gap-2">
                          {order.status !== "cancelled" &&
                            order.status !== "delivered" && (
                              <>
                                <div className="relative group">
                                  <button
                                    onClick={() => {
                                      let nextStatus = "";
                                      if (order.status === "pending")
                                        nextStatus = "approved";
                                      else if (order.status === "approved")
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
                                    className={`px-3 py-1.5 rounded-md text-sm text-white ${
                                      order.status === "processing" &&
                                      order.paymentStatus.toLowerCase() ===
                                        "pending"
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                    disabled={
                                      order.status === "processing" &&
                                      order.paymentStatus.toLowerCase() ===
                                        "pending"
                                    }
                                  >
                                    {order.status === "pending"
                                      ? "Approve Order"
                                      : order.status === "approved"
                                      ? "Mark as Processing"
                                      : order.status === "processing"
                                      ? "Mark as Delivered"
                                      : ""}
                                  </button>

                                  {order.status === "processing" &&
                                    order.paymentStatus.toLowerCase() ===
                                      "pending" && (
                                      <div className="absolute top-full left-0 mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shadow-md z-10 whitespace-nowrap">
                                        Cannot mark as delivered. Payment is
                                        pending.
                                      </div>
                                    )}
                                </div>

                                <button
                                  onClick={() => cancelOrder(order._id)}
                                  className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600"
                                >
                                  Reject Order
                                </button>
                              </>
                            )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            Order Date:{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                          <p className="text-gray-600">
                            Status:{" "}
                            <span className="capitalize font-medium">
                              {order.status}
                            </span>
                          </p>
                          <p className="text-gray-600">
                            Payment Status:{" "}
                            <span
                              className={`font-medium ${
                                order.paymentStatus.toLowerCase() === "pending"
                                  ? "text-yellow-600"
                                  : order.paymentStatus.toLowerCase() ===
                                    "partial"
                                  ? "text-orange-500"
                                  : "text-green-600"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-gray-600">
                            Paid: ${Number(order.payment || 0).toFixed(2)} / $
                            {Number(order.amount).toFixed(2)}
                          </p>
                          {remaining > 0 && (
                            <p className="text-sm text-red-600">
                              Remaining: ${remaining.toFixed(2)}
                            </p>
                          )}
                          <p className="font-semibold text-lg text-gray-900">
                            Total: ${Number(order.amount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Admin payment input */}
                      {order.status === "cancelled" ? (
                        <p className="text-red-600 text-sm font-medium">
                          Order Cancelled
                        </p>
                      ) : remaining > 0 ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={remaining}
                            placeholder={`Remaining: $${remaining.toFixed(2)}`}
                            className="border px-2 py-1.5 rounded-md w-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                toast.error(
                                  "Payment cannot exceed remaining amount"
                                );
                                return;
                              }
                              updatePayment(order._id, payment);
                            }}
                            className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700"
                          >
                            Update Payment
                          </button>
                        </div>
                      ) : (
                        <p className="text-green-600 text-sm font-medium">
                          Payment complete
                        </p>
                      )}

                      {/* Address Info */}
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          Customer: {order.address.firstName}{" "}
                          {order.address.lastName}
                        </p>
                        <p>Email: {order.address.email}</p>
                        <p>Phone: {order.address.phone}</p>
                        <p>
                          Address: {order.address.street}, {order.address.city},{" "}
                          {order.address.province} {order.address.zipcode}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="flex overflow-x-auto gap-4 pt-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="min-w-[200px] flex-shrink-0 border rounded-lg p-4 shadow-sm"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-32 object-cover rounded"
                            />
                            <p className="font-semibold mt-2">
                              {item.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              Wood: {item.wood}
                            </p>
                            <p className="text-sm text-gray-600">
                              Size: {item.length}x{item.breadth}x{item.height}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
