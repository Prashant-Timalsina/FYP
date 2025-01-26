import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App'; // Adjust based on your project structure
import { assets } from '../assets/assets'; // If you have static assets like icons

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [category, setCategory] = useState(''); // State for category name
  const [image, setImage] = useState('');

  // Fetch product data from the backend
  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/single/${id}`);
      if (response.data.success) {
        const product = response.data.product;
        setProductData(product);
        setImage(product.image[0]); // Set the first image as default

        // Fetch category once product data is available
        if (product.category) {
          fetchCategory(product.category);
        }
      } else {
        console.error('Error fetching product data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  // Fetch category data based on category ID
  const fetchCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/single/${categoryId}`);
      if (response.data.success) {
        setCategory(response.data.category.name); // Set category name
      } else {
        console.error('Error fetching category:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  // Fetch product data on component mount
  useEffect(() => {
    fetchProductData();
  }, [id]);

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* ----------------- Product Data ----------------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ----------------- Product Images ----------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)} // Set selected image on click
                src={item}
                alt={`Product image ${index + 1}`}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt={productData.name} className="w-full h-auto" />
          </div>
        </div>

        {/* ----------------- Product Info ----------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {/* Render rating stars */}
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
          <p className="mt-5 text-sm text-gray-500">Category: {category || 'Loading...'}</p> {/* Show category name */}
          <p className="mt-5 text-3xl font-medium">${productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          <button onClick={() => handleUpdate(productData._id)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            UPDATE
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 flex flex-col gap-1">
            <p className="pt-2">100% original Product</p>
            <p>Cash on delivery is available for this product</p>
            <p>Easy refund and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      {/* ----------------- Description & Review Section ----------------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>{productData.description}</p>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div> // Show loading state until data is fetched
  );
};

export default Product;
