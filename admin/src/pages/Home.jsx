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
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Sales by Categories</h2>
          <Pie data={pieData} />
        </div>
        <div className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">This Week Sales</h2>
          <Bar data={barData} />
        </div>
      </div>
      <div className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold mb-2">Sales History</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Item</th>
              <th className="py-2 px-4 border-b">Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesHistory.map((sale, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{sale.date}</td>
                <td className="py-2 px-4 border-b">{sale.item}</td>
                <td className="py-2 px-4 border-b">{sale.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
