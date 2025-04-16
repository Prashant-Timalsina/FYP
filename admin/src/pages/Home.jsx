import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const Home = () => {
  // Placeholder data for the pie chart
  const pieData = {
    labels: ["Category 1", "Category 2", "Category 3"],
    datasets: [
      {
        label: "Sales by Categories",
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Placeholder data for the bar chart
  const barData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "This Week Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  // Placeholder sales history data
  const salesHistory = [
    { date: "2023-01-01", item: "Item 1", amount: "$100" },
    { date: "2023-01-02", item: "Item 2", amount: "$200" },
    { date: "2023-01-03", item: "Item 3", amount: "$150" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Charts Section */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Pie Chart */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Sales by Categories</h2>
              <div className="bg-white p-4 rounded-lg">
                <div className="relative h-[300px]">
                  <Pie data={pieData} />
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div>
              <h2 className="text-xl font-semibold mb-4">This Week Sales</h2>
              <div className="bg-white p-4 rounded-lg">
                <div className="relative h-[200px]">
                  <Bar data={barData} />
                </div>
              </div>
            </div>
          </div>

          {/* Sales History Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Sales History</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesHistory.map((sale, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
