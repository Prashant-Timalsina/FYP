import React, { useEffect, useState, useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";

const CategoryListTable = () => {
  const { backendUrl, navigate, token } = useContext(AdminContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/all`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = (id) => {
    navigate(`/updateCategory/${id}`);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/category/remove/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== id)
          );
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
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
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="group relative">
                      <span className="cursor-pointer hover:underline">
                        {category.name}
                      </span>
                      <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg p-4 w-64 z-10">
                        <div className="flex gap-4">
                          <img
                            src={category.image || assets.defaultImage}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-600">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpdateCategory(category._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {/* <FaTrash className="w-4 h-4" /> */}
                        <img
                          className="pl- w-3 h-3"
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
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryListTable;
