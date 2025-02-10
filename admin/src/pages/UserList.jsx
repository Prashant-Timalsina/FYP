import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets.js";

const UserList = () => {
  const { backendUrl, token } = useContext(AdminContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
        toast.success("Users fetched successfully!"); // Success toast
      } catch (err) {
        console.error("Error fetching users:", err); // Log the error
        toast.error("Failed to fetch users. Please try again later."); // Error toast
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendUrl, token]);

  if (loading) return <p className="text-center">Loading users...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="border p-4 rounded-lg shadow-md flex items-center"
          >
            <img
              src={user.image || assets.defaultImage}
              alt={user.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
