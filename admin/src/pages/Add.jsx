import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProduct = ({ token }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [category, setCategory] = useState("");
  const [woodName, setWoodName] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/all`);
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error fetching categories");
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("woodName", woodName);
    formData.append("length", length);
    formData.append("breadth", breadth);
    formData.append("height", height);

    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);
    image3 && formData.append("image3", image3);
    image4 && formData.append("image4", image4);

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData
        // { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setCategory("");
        setWoodName("");
        setLength("");
        setBreadth("");
        setHeight("");
        navigate("/add");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error in form submission: ",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full items-start gap-3 p-6 bg-white shadow-md rounded-md"
    >
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt="Upload"
            />
            <input
              onChange={(e) => handleImageChange(e, setImage1)}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt="Upload"
            />
            <input
              onChange={(e) => handleImageChange(e, setImage2)}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt="Upload"
            />
            <input
              onChange={(e) => handleImageChange(e, setImage3)}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt="Upload"
            />
            <input
              onChange={(e) => handleImageChange(e, setImage4)}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          type="text"
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 border rounded-md"
          placeholder="Enter product description"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Price</p>
        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          className="w-full max-w-[100px] px-3 py-2 border rounded-md"
          type="number"
          placeholder="0"
          min="0"
          required
        />
      </div>

      <div className="flex flex-col w-full gap-4 mb-4">
        <div className="flex flex-col w-full">
          <p className="mb-2">Category</p>
          <div className="flex gap-2 items-center">
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-[40%] max-w-[250px] px-3 py-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => navigate("/addCategory")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <p className="mb-2">Wood Name</p>
          <div className="flex gap-2 items-center">
            <input
              onChange={(e) => setWoodName(e.target.value)}
              value={woodName}
              className="w-[40%] max-w-[250px] px-3 py-2 border rounded-md"
              type="text"
              placeholder="Enter wood name"
              required
            />
            <button
              type="button"
              onClick={() => navigate("/addWood")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Wood Name
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 w-full">
        <div className="flex flex-col">
          <p className="mb-2">Length</p>
          <input
            onChange={(e) => setLength(e.target.value)}
            value={length}
            className="w-full max-w-[100px] px-3 py-2 border rounded-md"
            type="number"
            placeholder="0"
            min="0"
            required
          />
        </div>
        <div className="flex flex-col">
          <p className="mb-2">Breadth</p>
          <input
            onChange={(e) => setBreadth(e.target.value)}
            value={breadth}
            className="w-full max-w-[100px] px-3 py-2 border rounded-md"
            type="number"
            placeholder="0"
            min="0"
            required
          />
        </div>
        <div className="flex flex-col">
          <p className="mb-2">Height</p>
          <input
            onChange={(e) => setHeight(e.target.value)}
            value={height}
            className="w-full max-w-[100px] px-3 py-2 border rounded-md"
            type="number"
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="w-36 py-3 mt-4 bg-black text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Product
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
