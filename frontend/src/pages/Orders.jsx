import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title.jsx";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";

const Orders = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const resultPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/order/myorder?page=${currentPage}&limit=${resultPerPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data.orders || []);
        setTotalPages(
          Math.ceil((response.data.totalOrders || 0) / resultPerPage)
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [backendUrl, token, currentPage]);

  return (
    <div className="flex flex-col md:flex-row gap-6 pt-10 px-4 border-t">
      {/* Left Side - Filters */}
      <aside className="min-w-60 md:w-1/4">
        <h2 className="text-xl font-semibold mb-4">FILTERS</h2>
        <div className="border border-gray-300 p-4 rounded-md bg-gray-50">
          <p className="mb-3 text-sm font-medium">ORDER STATUS</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4" />
              Pending
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4" />
              Cancelled
            </label>
          </div>
        </div>
      </aside>

      {/* Right Side - Orders List */}
      <section className="flex-1">
        <div className="mb-6">
          <Title text1={"YOUR"} text2={"ORDERS"} />
        </div>

        {orders.length > 0 ? (
          orders.map((order, orderIndex) => (
            <div
              key={orderIndex}
              className="border rounded-lg p-6 mb-8 shadow-sm bg-white"
            >
              <h2 className="text-lg font-bold mb-4">Order #{order._id}</h2>

              {order.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex flex-col md:flex-row items-center gap-4 mb-6"
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name || "Product Image"}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Category: {item.category}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Wood Type: {item.wood}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Dimensions: {item.length} x {item.breadth} x {item.height}{" "}
                      cm
                    </p>
                    <p className="font-bold text-md mt-1">
                      Price: ${item.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-semibold text-sm">Refund:</span>
                    <span className="text-green-700 font-medium text-lg">
                      ${order.refundAmount || 0}
                    </span>
                    <span className="text-sm text-gray-700 mt-1">
                      Status:{" "}
                      <span className="font-semibold">{order.status}</span>
                    </span>
                    <button className="bg-red-500 text-white text-sm px-4 py-1.5 rounded hover:bg-red-600 mt-2">
                      Cancel Order
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-right text-lg font-bold">
                Total Order Amount: ${order.amount}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No orders found.</p>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-base font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default Orders;
