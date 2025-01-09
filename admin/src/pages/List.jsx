import React from "react";
import { products } from "../assets/assets";

const List = () => {
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
          products.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 object-cover"
              />
              <p>{product.name}</p>
              <p>{product.category}</p>
              <p>${product.price}</p>
              <div className="flex flex-col">
                <p>L: {product.length}</p>
                <p>B: {product.breadth}</p>
                <p>H: {product.height}</p>
              </div>
              <button className="text-center text-red-400 hover:text-red-800 cursor-pointer">
                Delete
              </button>
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
