import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets"; // If you have any static assets like icons
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const {
    // backendUrl,
    // navigate,
    addToCart,
    product,
    category,
    wood,
    fetchProductData,
  } = useContext(ShopContext);
  const { id } = useParams();
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchProductData(id);
  }, [id]);

  useEffect(() => {
    if (product?.image) {
      setImage(product.image[0]); // Set default image
    }
  }, [product]);

  // Handle displaying the product information
  return product ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {product.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                alt={`Product image ${index + 1}`}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt={product.name} className="w-full h-auto" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{product.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={index < 4 ? assets.star_rated : assets.star_unrated}
                alt="star"
                className="w-3.5"
              />
            ))}
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">${product.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{product.description}</p>

          {/* Category */}
          <p className="mt-5 text-sm text-gray-500">
            Category: {category || "Category Missing"}
          </p>

          {/* Wood Type */}
          <p className="mt-5 text-sm text-gray-500">
            Wood: {wood || "Wood Missing"}
          </p>

          {/* Dimensions */}
          <div className="flex gap-3 mt-5 mb-5 sm:w-4/5">
            <div className="flex flex-col gap-1">
              <p className="text-sm">Length</p>
              <p className="text-sm">Breadth</p>
              <p className="text-sm">Height</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm">{product.length} cm</p>
              <p className="text-sm">{product.breadth} cm</p>
              <p className="text-sm">{product.height} cm</p>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() =>
              addToCart(
                product._id,
                product.length,
                product.breadth,
                product.height
              )
            }
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 flex flex-col gap-1">
            <p className="pt-2">100% original Product</p>
            <p>Cash on delivery is available for this product</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Product;
