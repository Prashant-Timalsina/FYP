import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title.jsx";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { token, backendUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
  });

  const resultPerPage = 5;
  const navigate = useNavigate();

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: resultPerPage,
      });

      // Add status filter if selected
      if (filters.status) {
        params.append("status", filters.status);
      }
      // Add payment status filter if selected
      if (filters.paymentStatus) {
        params.append("paymentStatus", filters.paymentStatus);
      }

      const response = await axios.get(
        `${backendUrl}/api/order/myorder?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [backendUrl, token, currentPage, filters]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
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
        fetchOrders(currentPage);
      }
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Title text1={"YOUR"} text2={"ORDERS"} />
            <div className="flex flex-col gap-4">
              {/* Order Status Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange("status", "")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === ""
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => handleFilterChange("status", "pending")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange("status", "processing")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "processing"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Processing
                </button>
                <button
                  onClick={() => handleFilterChange("status", "delivered")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "delivered"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Delivered
                </button>
                <button
                  onClick={() => handleFilterChange("status", "cancelled")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.status === "cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Cancelled
                </button>
              </div>

              {/* Payment Status Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange("paymentStatus", "")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === ""
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Payments
                </button>
                <button
                  onClick={() => handleFilterChange("paymentStatus", "Pending")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === "Pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Pending Payment
                </button>
                <button
                  onClick={() => handleFilterChange("paymentStatus", "Partial")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === "Partial"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Partial Payment
                </button>
                <button
                  onClick={() => handleFilterChange("paymentStatus", "Paid")}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    filters.paymentStatus === "Paid"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>
          <p className="text-base font-semibold text-blue-600">
            Note: COD requires pre payment of 20%
          </p>

          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found{" "}
              {filters.status || filters.paymentStatus
                ? `with ${filters.status ? `status "${filters.status}"` : ""} ${
                    filters.status && filters.paymentStatus ? "and" : ""
                  } ${
                    filters.paymentStatus
                      ? `payment status "${filters.paymentStatus}"`
                      : ""
                  }`
                : ""}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => {
                  const isPaid = order.payment === order.amount;
                  const remaining = order.amount - (order.payment || 0);

                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow-sm p-6 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-gray-900">
                          Order ID: {order._id}
                        </p>
                        <div className="flex gap-2">
                          {(order.status === "approved" ||
                            order.status === "processing") && (
                            <button
                              onClick={() => {
                                const paymentData = {
                                  amount: remaining,
                                  totalAmount: order.amount,
                                  orderId: order._id,
                                  success_url:
                                    "http://localhost:5173/payment-success",
                                  failure_url:
                                    "http://localhost:5173/payment-failure",
                                };
                                navigate("/payment", { state: paymentData });
                              }}
                              className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-600"
                            >
                              Pay Now
                            </button>
                          )}

                          {order.status !== "cancelled" &&
                            order.status !== "delivered" && (
                              <button
                                onClick={() => cancelOrder(order._id)}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600"
                              >
                                Cancel Order
                              </button>
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
                            Paid: {currency}
                            {Number(order.payment || 0).toFixed(2)} / {currency}
                            {Number(order.amount).toFixed(2)}
                          </p>
                          {remaining > 0 && (
                            <p className="text-sm text-red-600">
                              Remaining: {currency}
                              {remaining.toFixed(2)}
                            </p>
                          )}
                          <p className="font-semibold text-lg text-gray-900">
                            Total: {currency}
                            {Number(order.amount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

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
                            <p className="font-semibold mt-2">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Wood: {item.wood}
                            </p>
                            <p className="text-sm text-gray-600">
                              Size: {item.length}x{item.breadth}x{item.height}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-medium mt-1">
                              Price: {currency}
                              {item.price}
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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
