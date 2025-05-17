import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";
import { FaUserCircle, FaHeart } from "react-icons/fa";

const Profile = () => {
  const { backendUrl, token, favorites, navigate, removeFromFavorites } =
    useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderCount, setOrderCount] = useState(0);
  const itemsPerPage = 6;

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

    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/myorder`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setOrderCount(response.data.totalOrders);
        }
      } catch (err) {
        console.error("Error fetching user orders:", err);
      }
    };

    fetchUserData();
    fetchUserOrders();
  }, [token, backendUrl]);

  const handleRemoveFromFavorites = (productId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this product from your favorites?"
      )
    ) {
      removeFromFavorites(productId);
      window.location.reload();
    }
  };

  const handleProductClick = (productId) => {
    if (window.confirm("Do you want to view this product?")) {
      navigate(`/product/${productId}`);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorites = favorites.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (error) {
    toast.error(error);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mb-6">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-white text-8xl" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <div className="w-full border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {orderCount}
                      </p>
                      <p className="text-sm text-gray-500">Orders</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {favorites.length}
                      </p>
                      <p className="text-sm text-gray-500">Favorites</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <Title text1="MY" text2="FAVORITES" />
                <span className="text-sm text-gray-500">
                  {favorites.length} items
                </span>
              </div>

              {favorites.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentFavorites.map((product) => (
                      <div
                        key={product._id}
                        className="group relative bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {product.name}
                          </h3>
                          {/* <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {product.category}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {product.wood}
                            </span>
                          </div> */}
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500">
                                Price
                              </span>
                              <span className="font-semibold text-primary">
                                ${product.price}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductClick(product._id);
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
                              >
                                View Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromFavorites(product._id);
                                }}
                                className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors duration-300"
                                title="Remove from favorites"
                              >
                                <FaHeart />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-300"
                        >
                          Previous
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage === page
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            } transition-colors duration-300`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-300"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaHeart className="text-gray-400 text-5xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Favorites Yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start adding products to your favorites to see them here.
                  </p>
                  <button
                    onClick={() => navigate("/products")}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
                  >
                    Browse Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
