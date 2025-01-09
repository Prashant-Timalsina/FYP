import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddWood = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [characteristics, setCharacteristics] = useState([""]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCharacteristicChange = (index, value) => {
    const newCharacteristics = [...characteristics];
    newCharacteristics[index] = value;
    setCharacteristics(newCharacteristics);
  };

  const handleAddCharacteristic = () => {
    setCharacteristics([...characteristics, ""]);
  };

  const handleRemoveCharacteristic = () => {
    if (characteristics.length > 1) {
      setCharacteristics(characteristics.slice(0, -1));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("characteristics", JSON.stringify(characteristics));

    try {
      const response = await axios.post(`${backendUrl}/api/wood/add`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setImage(null);
        setDescription("");
        setCharacteristics([""]);
        navigate("/add");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding wood:", error);
      toast.error("Error adding wood");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md w-full max-w-md mx-auto">
      <button
        onClick={() => navigate("/add")}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Back to Add Product
      </button>
      <h2 className="text-2xl font-bold mb-4">Add Wood Name</h2>
      <div className="mb-4">
        <label className="block mb-2">Wood Image</label>
        <label htmlFor="woodImage">
          <img
            className="w-20"
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt="Upload"
          />
          <input
            onChange={handleImageChange}
            type="file"
            id="woodImage"
            hidden
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Wood Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter wood name"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Wood Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter wood description"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Characteristics</label>
        <div className="max-h-40 overflow-y-auto">
          <ol className="list-decimal pl-5">
            {characteristics.map((characteristic, index) => (
              <li key={index} className="mb-2">
                <input
                  value={characteristic}
                  onChange={(e) =>
                    handleCharacteristicChange(index, e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter characteristic"
                />
              </li>
            ))}
          </ol>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddCharacteristic}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleRemoveCharacteristic}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            -
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate("/add")}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddWood;
