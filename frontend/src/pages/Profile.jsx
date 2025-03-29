import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { backendUrl, token, favorites, navigate, removeFromFavorites } =
    useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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

  const handleRemoveFromFavorites = (productId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this product from your favorites?"
      )
    ) {
      removeFromFavorites(productId);
      window.location.reload(); // Refresh page to update favorites
    }
  };

  const handleProductClick = (productId) => {
    if (window.confirm("Do you want to view this product?")) {
      navigate(`/product/${productId}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Profile Section */}
        <div>
          <div className="text-base sm:text-2xl mb-4">
            <Title text1="MY" text2="PROFILE" />
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:w-1/2">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-500 text-6xl" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="sm:w-1/2">
          <div className="text-base sm:text-2xl mb-4">
            <Title text1="MY" text2="FAVORITES" />
          </div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {favorites.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="hidden sm:block text-gray-500">
                      {product.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromFavorites(product._id);
                    }}
                    className="p-2 rounded bg-red-500 text-white"
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No favorite products added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
