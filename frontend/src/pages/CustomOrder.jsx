import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import DeliveryInformation from "../components/DeliveryInformation";

const CustomProduct = () => {
  const { backendUrl, navigate, token, delivery_fee } = useContext(ShopContext);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [wood, setwood] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [woods, setWoods] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    province: "",
    zipcode: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

    // Calculate base price without quantity
    const basePrice =
      selectedCategory.price * selectedWood.price * length * breadth * height;
    setPrice(basePrice.toFixed(2));
  };

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!description || !category || !wood || !length || !breadth || !height) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!price) {
      toast.error("Please calculate price before submitting");
      return;
    }

    // Validate delivery information
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.street ||
      !formData.city ||
      !formData.province ||
      !formData.zipcode ||
      !formData.phone
    ) {
      toast.error("Please fill all delivery information fields");
      return;
    }

    try {
      const selectedCategory = categories.find((c) => c._id === category);
      const selectedWood = woods.find((w) => w._id === wood);

      const orderItems = [
        {
          name: description,
          category: selectedCategory.name,
          wood: selectedWood.name,
          length: Number(length),
          breadth: Number(breadth),
          height: Number(height),
          image: image1 ? URL.createObjectURL(image1) : null,
          quantity: Number(quantity),
          price: Number(price),
        },
      ];

      // Calculate total amount without delivery fee
      const totalAmount = Number(price) * Number(quantity);

      const orderData = {
        items: orderItems,
        address: formData,
        amount: totalAmount,
      };

      const response = await axios.post(
        `${backendUrl}/api/order/physical`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
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
        setQuantity(1);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          street: "",
          city: "",
          province: "",
          zipcode: "",
          phone: "",
        });
        navigate("/orders");
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
      onSubmit={onSubmitHandler}
      className="flex flex-col lg:flex-row gap-10"
    >
      {/* Left Side - Custom Product Details */}
      <div className="flex-1 space-y-6">
        {/* Product Details */}
        <div className="w-full border border-gray-300 p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-bold mb-4">Custom Product Details</h2>

          {/* Image Upload */}
          <div className="mb-4">
            <p className="mb-2">Upload Images (Design Reference only)</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: "image1",
                  image: image1,
                  setImage: setImage1,
                },
                {
                  id: "image2",
                  image: image2,
                  setImage: setImage2,
                },
                {
                  id: "image3",
                  image: image3,
                  setImage: setImage3,
                },
                {
                  id: "image4",
                  image: image4,
                  setImage: setImage4,
                },
              ].map(({ id, image, setImage }) => (
                <div key={id} className="flex flex-col items-center">
                  <label htmlFor={id} className="cursor-pointer">
                    <img
                      className="w-[150px] h-[150px] object-cover border rounded-lg"
                      src={
                        !image ? assets.upload_area : URL.createObjectURL(image)
                      }
                      alt={id}
                    />
                    {/* <p className="text-sm text-center mt-2">{label}</p> */}
                    <input
                      onChange={(e) => handleImageChange(e, setImage)}
                      type="file"
                      id={id}
                      hidden
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="mb-2">Product Description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Category & Wood Selection */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="mb-2">Category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="w-full px-3 py-2 border rounded-md"
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
                className="w-full px-3 py-2 border rounded-md"
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

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-4 mb-4">
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
                  className="w-full px-3 py-2 border rounded-md"
                  onChange={(e) => setter(e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Price Calculation */}
          <div className="flex items-center gap-4 mb-4">
            <button
              className="border px-3 py-2"
              type="button"
              onClick={calculatePrice}
            >
              Calculate Price
            </button>
            <span className="text-lg font-semibold">
              Price: <span className="underline font-bold px-3">{price}</span>
            </span>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <p className="mb-2">
              Quantity{"  "}
              <span className="text-red-500 text-sm">
                (Quantity is not calculated in price)
              </span>
            </p>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="w-full text-end mt-8">
          <p className="text-base font-semibold text-blue-600">
            Note: COD requires pre payment of 20%
          </p>
          <button
            type="submit"
            className="bg-black text-white px-16 py-3 text-sm"
          >
            PLACE ORDER
          </button>
        </div>
      </div>

      {/* Right Side - Delivery Information */}
      <DeliveryInformation
        formData={formData}
        onChangeHandler={onChangeHandler}
      />
    </form>
  );
};

export default CustomProduct;
