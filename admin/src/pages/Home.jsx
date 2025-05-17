import React, { useContext, useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";

const Home = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState({});
  const [weeklyData, setWeeklyData] = useState({});

  // Chart options with animations
  const chartOptions = {
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Bar chart specific options
  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    animation: {
      ...chartOptions.animation,
      onProgress: function (animation) {
        const progress = animation.currentStep / animation.numSteps;
        const ctx = animation.chart.ctx;
        ctx.save();
        ctx.fillStyle = "rgba(75, 192, 192, " + (0.3 + progress * 0.4) + ")";
      },
    },
  };

  // Pie chart specific options
  const pieChartOptions = {
    ...chartOptions,
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
      animateRotate: true,
      animateScale: true,
      onProgress: function (animation) {
        const progress = animation.currentStep / animation.numSteps;
        const chart = animation.chart;
        const ctx = chart.ctx;
        const datasets = chart.data.datasets;

        datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach((element, index) => {
              const originalValue = dataset.data[index];
              const animatedValue = originalValue * progress;

              // Update the data value for this segment
              dataset.data[index] = animatedValue;
            });
          }
        });

        chart.update("none"); // Update without animation
      },
    },
    transitions: {
      active: {
        animation: {
          duration: 400,
        },
      },
    },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/order/all?limit=1000`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setOrders(response.data.orders);
          processOrderData(response.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, backendUrl]);

  const processOrderData = (ordersData) => {
    // Process category data
    const categorySales = {};
    const weeklySales = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    ordersData.forEach((order) => {
      // Process category data
      order.items.forEach((item) => {
        const category = item.category || "Uncategorized";
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }
        categorySales[category] += item.price * item.quantity;
      });

      // Process weekly data
      const orderDate = new Date(order.createdAt);
      const dayOfWeek = orderDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      weeklySales[dayOfWeek] += order.amount;
    });

    setCategoryData(categorySales);
    setWeeklyData(weeklySales);
  };

  // Prepare pie chart data
  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Sales by Categories",
        data: Object.values(categoryData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 2,
        borderColor: "#fff",
        hoverBorderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  // Prepare bar chart data
  const barData = {
    labels: Object.keys(weeklyData),
    datasets: [
      {
        label: "This Week Sales",
        data: Object.values(weeklyData),
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  // Get recent sales history
  const salesHistory = orders.slice(0, 5).map((order) => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    item: order.items.map((item) => item.name).join(", "),
    amount: `$${order.amount.toFixed(2)}`,
  }));

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Charts Section */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Pie Chart */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Sales by Categories
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative h-[300px]">
                  <Pie data={pieData} options={pieChartOptions} redraw={true} />
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div>
              <h2 className="text-xl font-semibold mb-4">This Week Sales</h2>
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative h-[200px]">
                  <Bar data={barData} options={barChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Sales History Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Recent Sales History</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesHistory.map((sale, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {sale.item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
