import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title.jsx";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";

const Orders = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [orders, setOrders] = useState([]); // Store fetched orders
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  const resultPerPage = 5; // Orders per page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/order/myorder?page=${currentPage}&limit=${resultPerPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrders(response.data.orders);
        setTotalPages(Math.ceil(response.data.totalOrders / resultPerPage)); // Update total pages dynamically
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [backendUrl, token, currentPage]);

  return (
    <div className="flex flex-col md:flex-row gap-4 pt-10 border-t">
      {/* Left Side - Filters */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center gap-2">FILTERS</p>
        <div className="border border-gray-300 pl-5 py-3">
          <p className="mb-3 text-sm font-medium">ORDER STATE</p>
          <div className="flex flex-col gap-2">
            <label htmlFor="pending" className="flex gap-2 items-center">
              <input id="pending" type="checkbox" className="w-3" />
              Pending
            </label>
            <label htmlFor="cancelled" className="flex gap-2 items-center">
              <input id="cancelled" type="checkbox" className="w-3" />
              Cancelled
            </label>
          </div>
        </div>
      </div>

      {/* Right Side - Orders List */}
      <div className="flex-1">
        <div className="flex flex-row md:flex-row justify-between text-base sm:text-2xl mb-4">
          <Title text1={"YOUR"} text2={"ORDERS"} />
        </div>

        <div>
          {orders.length > 0 ? (
            orders.map((order, orderIndex) => (
              <div
                key={orderIndex}
                className="border rounded-lg p-4 mb-6 shadow-md bg-white"
              >
                <h2 className="text-lg font-bold mb-4">Order #{order._id}</h2>

                {order.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex flex-col md:flex-row items-center gap-4 mb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{item.name}</h2>
                      <p className="text-gray-600">Category: {item.category}</p>
                      <p className="text-gray-600">Wood Type: {item.wood}</p>
                      <p className="text-gray-600">
                        Dimensions: {item.length}x{item.breadth}x{item.height}{" "}
                        cm
                      </p>
                      <p className="font-bold text-lg">Price: ${item.price}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h2 className="font-bold">Remaining Money</h2>
                      <p className="text-gray-700">${order.refundAmount}</p>
                      <p className="text-gray-600">Status: {order.status}</p>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        Cancel Order
                      </button>
                    </div>
                  </div>
                ))}

                {/* Display the total order amount once */}
                <div className="text-right font-bold text-lg mt-4">
                  Total Order Amount: ${order.amount}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No orders found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
