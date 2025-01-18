import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleShowProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/remove/${id}`);
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
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Dimensions</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-12 h-12 object-cover"
              />
              {/* Clickable product name */}
              <p
                onClick={() => handleShowProduct(product._id)}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                {product.name}
              </p>
              <p>{product.category.name}</p>
              <p>${product.price}</p>
              <div className="flex flex-col">
                <p>L: {product.length}</p>
                <p>B: {product.breadth}</p>
                <p>H: {product.height}</p>
              </div>
              <div className="flex flex-col items-center">
                <button className="text-center text-blue-400 hover:text-blue-800 cursor-pointer mb-2">
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-center text-red-400 hover:text-red-800 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default List;
