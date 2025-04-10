import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const CustomProduct = () => {
  const { backendUrl, navigate, token } = useContext(ShopContext);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [wood, setwood] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [woods, setWoods] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

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
  }, [backendUrl, token]);

  useEffect(() => {
    const fetchWoods = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/wood/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setWoods(response.data.woods);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching woods:", error);
        toast.error("Error fetching woods");
      }
    };

    fetchWoods();
  }, [backendUrl, token]);

  const calculatePrice = () => {
    const selectedCategory = categories.find((c) => c._id === category);
    const selectedWood = woods.find((w) => w._id === wood);

    if (!selectedCategory || !selectedWood || !length || !breadth || !height) {
      toast.warning("Please select category, wood and enter dimensions");
      return;
    }

    const totalPrice =
      selectedCategory.price * selectedWood.price * length * breadth * height;
    setPrice(totalPrice.toFixed(2));
  };

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !category || !wood || !length || !breadth || !height) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!price) {
      toast.error("Please calculate price before submitting");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("category", category);
    formData.append("wood", wood);
    formData.append("length", length);
    formData.append("breadth", breadth);
    formData.append("height", height);
    formData.append("price", price);

    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);
    if (image4) formData.append("image4", image4);

    // Debugging: Log form data before sending the request
    console.log("Form Data Submitted:");
    console.log({
      description,
      category,
      wood,
      length,
      breadth,
      height,
      price,
      images: [image1, image2, image3, image4].filter(Boolean), // Only include non-null images
    });

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/addCustom`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setDescription("");
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setCategory("");
        setwood("");
        setLength("");
        setBreadth("");
        setHeight("");
        setPrice("");
        navigate("/cart");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error in form submission:", error.response?.data || error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  w-full items-start gap-3 p-6 bg-white shadow-md rounded-md"
    >
      <h1 className="text-2xl font-bold mb-4">Custom Product</h1>

      {/* Image Upload */}
      <div>
        <p className="mb-2">Upload Image (Design Reference only)</p>
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
          <label htmlFor="image1">
            <img
              className="w-[150px] h-[150px] object-cover"
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
              className="w-[150px] h-[150px] object-cover"
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
              className="w-[150px] h-[150px] object-cover"
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
              className="w-[150px] h-[150px] object-cover"
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

      {/* Description */}
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

      {/* Category & Wood Selection */}
      <div className="flex flex-col w-full gap-4 mb-4">
        <div>
          <p className="mb-2">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="px-3 py-2 border rounded-md"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}: {cat.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Wood Name</p>
          <select
            onChange={(e) => setwood(e.target.value)}
            value={wood}
            className="px-3 py-2 border rounded-md"
            required
          >
            <option value="" disabled>
              Select wood
            </option>
            {woods.map((wood) => (
              <option key={wood._id} value={wood._id}>
                {wood.name}: {wood.price}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dimensions & Price Calculation */}
      <div className="flex flex-wrap gap-2">
        {[
          ["Length", setLength],
          ["Breadth", setBreadth],
          ["Height", setHeight],
        ].map(([label, setter]) => (
          <div key={label}>
            <p className="mb-2">{label}</p>
            <input
              type="number"
              min="0"
              className="px-3 py-2 border rounded-md"
              onChange={(e) => setter(e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        className="border px-3 py-2 mt-4"
        type="button"
        onClick={calculatePrice}
      >
        Calculate Price
      </button>

      <span className="text-lg font-semibold">
        Price: <span className="underline font-bold px-3">{price}</span>
      </span>

      <button
        type="submit"
        className="mt-4 bg-black text-white px-4 py-2 rounded-md"
      >
        Add To Cart
      </button>
    </form>
  );
};

export default CustomProduct;
