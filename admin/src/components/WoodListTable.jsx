import React, { useEffect, useState, useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";

const WoodListTable = () => {
  const { backendUrl, navigate, token } = useContext(AdminContext);
  const [woodNames, setWoodNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWoodNames();
  }, []);

  const fetchWoodNames = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/wood/all`);
      setWoodNames(response.data.woods);
    } catch (error) {
      console.error("Error fetching wood names:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWood = (id) => {
    navigate(`/updateWood/${id}`);
  };

  const handleDeleteWood = async (id) => {
    if (window.confirm("Are you sure you want to delete this wood?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/wood/remove/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setWoodNames((prevWoods) =>
            prevWoods.filter((wood) => wood._id !== id)
          );
        }
      } catch (error) {
        console.error("Error deleting wood:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading wood names...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {woodNames.length > 0 ? (
              woodNames.map((wood) => (
                <tr
                  key={wood._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="group relative">
                      <span className="cursor-pointer hover:underline">
                        {wood.name}
                      </span>
                      <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg p-4 w-64 z-10">
                        <div className="flex gap-4">
                          <img
                            src={wood.image || assets.defaultImage}
                            alt={wood.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{wood.name}</p>
                            <p className="text-sm text-gray-600">
                              {wood.description}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Advantages:</span>{" "}
                              {wood.advantages}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpdateWood(wood._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleDeleteWood(wood._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {/* <FaTrash className="w-4 h-4" /> */}
                        <img
                          className="w-3 h-3"
                          src={assets.close}
                          alt="trash"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  No wood names found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WoodListTable;
