import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // For static assets like image placeholders

const UpdateCategory = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null); // New state for category image

  // Fetch the category details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/category/single/${id}`
        );
        if (response.data.success) {
          const category = response.data.category;
          setCategoryData(category);
          setName(category.name);
          setDescription(category.description);
          setCategoryImage(category.image || null); // Set the category image if available
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        toast.error("Error fetching category details");
      }
    };

    fetchCategoryDetails();
  }, [id]);

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    if (categoryImage instanceof File) {
      formData.append("image", categoryImage); // Append the new image if it's a file
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/category/update/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/list`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error updating category:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return categoryData ? (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col w-full items-start gap-3 p-6 bg-white shadow-md rounded-md"
    >
      <h1 className="text-2xl font-bold mb-4">Update Category</h1>

      {/* Category Image */}
      <div>
        <p className="mb-2">Category Image</p>
        <label htmlFor="categoryImage">
          <img
            className="w-20"
            src={
              categoryImage instanceof File
                ? URL.createObjectURL(categoryImage)
                : categoryImage || assets.upload_area
            }
            alt="Upload"
          />
          <input
            onChange={handleImageChange}
            type="file"
            id="categoryImage"
            hidden
          />
        </label>
      </div>

      {/* Category Name */}
      <div className="w-full">
        <p className="mb-2">Category Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          type="text"
          placeholder="Enter category name"
          required
        />
      </div>

      {/* Category Description */}
      <div className="w-full">
        <p className="mb-2">Category Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          placeholder="Enter category description"
          required
        />
      </div>

      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="w-36 py-3 mt-4 bg-black text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Update Category
        </button>
      </div>
    </form>
  ) : (
    <div>Loading...</div>
  );
};

export default UpdateCategory;
