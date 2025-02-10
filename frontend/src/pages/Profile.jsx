import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";

const Profile = () => {
  const { backendUrl, token, userId } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Adjusted the endpoint to fetch data for the authenticated user (using `me`)
        const response = await axios.get(`${backendUrl}/api/user/single/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        toast.success("User data fetched successfully");
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch user";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className=" items-center justify-center p-4">
      <div className="text-base sm:text-2xl mb-4">
        <Title text1="MY" text2="PROFILE" />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Favorites</h2>
            <ul>
              <li>Favorite Item 1</li>
              <li>Favorite Item 2</li>
              <li>Favorite Item 3</li>
            </ul>
          </div>
        </div>
      </div>
      <div>Apple</div>
    </div>
    // <div className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row">
    //   <div className="md:w-1/2 p-4">
    //     <h2 className="text-xl font-semibold mb-4">Profile</h2>
    //     {user ? (
    //       <div>
    //         <img
    //           src={user.avatar || "default-avatar-url"}
    //           alt="User Avatar"
    //           className="w-24 h-24 rounded-full mb-4"
    //         />
    //         <p>
    //           <strong>Name:</strong> {user.name}
    //         </p>
    //         <p>
    //           <strong>Email:</strong> {user.email}
    //         </p>
    //       </div>
    //     ) : (
    //       <p>No user data available.</p>
    //     )}
    //   </div>
    //   <div className="md:w-1/2 p-4">
    //     <h2 className="text-xl font-semibold mb-4">Favorites</h2>
    //     {/* Replace with actual favorites list */}
    //     <ul>
    //       <li>Favorite Item 1</li>
    //       <li>Favorite Item 2</li>
    //       <li>Favorite Item 3</li>
    //     </ul>
    //   </div>
    // </div>
  );
};

export default Profile;
