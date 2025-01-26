import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const List = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [woodNames, setWoodNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredWood, setHoveredWood] = useState(null); // New state for hovered wood
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(
          `${backendUrl}/api/product/list`
        );
        const categoriesResponse = await axios.get(
          `${backendUrl}/api/category/all`
        );
        const woodNamesResponse = await axios.get(`${backendUrl}/api/wood/all`);
        setProducts(productsResponse.data.products);
        setCategories(categoriesResponse.data.categories);
        setWoodNames(woodNamesResponse.data.woods);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShowProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleUpdateProduct = (id) => {
    navigate(`/updateProduct/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/product/remove/${id}`
        );
        if (response.data.success) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== id)
          );
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleUpdateCategory = (id) => {
    navigate(`/updateCategory/${id}`);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/category/remove/${id}`
        );
        if (response.data.success) {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== id)
          );
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div className="space-y-6">
      {/* Product List */}
      <div className="p-6 h-[50vh] overflow-auto bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>
        <div className="flex flex-col gap-2">
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Dimensions</b>
            <b className="text-center">Action</b>
          </div>

          {products.length > 0 ? (
            products.map((product) => {
              const categoryName = product.category
                ? product.category.name
                : "Unknown";
              return (
                <div
                  key={product._id}
                  className="grid grid-cols-2 md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
                >
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                  <p
                    onClick={() => handleShowProduct(product._id)}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    {product.name}
                  </p>
                  <p>{categoryName}</p>
                  <p>${product.price}</p>
                  <div className="flex flex-col">
                    <p>L: {product.length}</p>
                    <p>B: {product.breadth}</p>
                    <p>H: {product.height}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleUpdateProduct(product._id)}
                      className="text-center text-blue-400 hover:text-blue-800 cursor-pointer mb-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-center text-red-400 hover:text-red-800 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center mt-4">No products found.</p>
          )}
        </div>
      </div>

      {/* Category and Wood Name List */}
      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6">
        {/* Category List */}
        <div className="p-6 w-full h-[40vh] overflow-y-scroll bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-4">Category List</h1>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1fr_0.1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
              <b>Name</b>
              <b className="text-center">Action</b>
            </div>
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="grid grid-cols-[1fr_1fr_0.1fr] items-center gap-2 py-1 px-2 border text-sm relative"
                >
                  <div className="cursor-pointer hover:underline group">
                    <span>{category.name}</span>
                    <div className="flex flex-col absolute left-0 top-6 hidden group-hover:block bg-white shadow-md p-4 border rounded-md w-64 z-10">
                      <div className="flex flex-row gap-4">
                        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={category.image || assets.defaultImage}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <div className="flex items-center gap-2">
                            <b>{category.name}</b>
                          </div>
                          <div className="text-sm">{category.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleUpdateCategory(category._id)}
                      className="text-center text-blue-400 hover:text-blue-800 cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                  <img
                    className="w-2 h-2 cursor-pointer opacity-50 hover:opacity-100"
                    src={assets.close}
                    onClick={() => handleDeleteCategory(category._id)}
                    alt="Delete"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-4">
                No categories found.
              </p>
            )}
          </div>
        </div>

        {/* Wood Name List */}
        <div className="p-6 w-full h-[40vh] overflow-y-scroll bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-4">Wood Name List</h1>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1fr_0.1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
              <b>Name</b>
              <b className="text-center">Action</b>
            </div>

            {/* Fetched Wood Names */}
            {woodNames.length > 0 ? (
              woodNames.map((wood) => (
                <div
                  key={wood._id}
                  className="grid grid-cols-[1fr_1fr_0.1fr] items-center gap-2 py-1 px-2 border text-sm relative"
                >
                  {/* Wood name with hover effect */}
                  <div className="cursor-pointer hover:underline group">
                    <span>{wood.name}</span>

                    {/* Hovered Wood Information */}
                    <div className="flex flex-col absolute left-0 top-6 hidden group-hover:block bg-white shadow-md p-4 border rounded-md w-64 z-10">
                      <div className="flex flex-row gap-4">
                        {/* Images Container */}
                        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                          {wood.images.length > 0 && (
                            <img
                              src={wood.images[0] || assets.defaultImage}
                              alt={wood.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Text Container */}
                        <div className="flex flex-col overflow-hidden">
                          {/* Wood Name */}
                          <div className="flex items-center gap-2">
                            <b>{wood.name}</b>
                          </div>

                          {/* Description */}
                          <div className="flex items-center gap-2">
                            <p className="text-sm">{wood.description}</p>
                          </div>

                          {/* Advantages List */}
                          <div className="flex flex-col">
                            <b>Advantages:</b>
                            {wood.advantages && wood.advantages.length > 0 ? (
                              wood.advantages.map((advantage, index) => (
                                <p
                                  key={index}
                                  className="text-sm"
                                >{`- ${advantage}`}</p>
                              ))
                            ) : (
                              <p>No advantages listed</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleUpdateCategory(wood._id)} // Assuming a similar update function
                      aria-label={`Update wood ${wood.name}`}
                      className="text-center text-blue-400 hover:text-blue-800 cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                  <img
                    className="w-2 h-2 cursor-pointer opacity-50 hover:opacity-100"
                    src={assets.close}
                    onClick={() => handleDeleteCategory(wood._id)} // Assuming a similar delete function
                    alt="Delete"
                    aria-label={`Delete wood ${wood.name}`}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-4">
                No wood names found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
