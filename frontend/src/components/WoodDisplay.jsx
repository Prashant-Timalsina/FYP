import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const WoodDisplay = () => {
  const { woods, products } = useContext(ShopContext);
  const [selectedWoodIndex, setSelectedWoodIndex] = useState(0);

  useEffect(() => {
    if (woods.length > 0) {
      setSelectedWoodIndex(0);
    }
  }, [woods]);

  const productCount = (woodId) => {
    return products.filter((product) => product.wood === woodId).length;
  };

  const handleWoodClick = (index) => {
    setSelectedWoodIndex(index);
  };

  const handleImageNav = () => {
    const selectedWood = woods[selectedWoodIndex].name;
    Navigate(`/collection?wood=${selectedWood}`);
  };

  const NextClick = () => {
    setSelectedWoodIndex((prev) => (prev + 1) % woods.length);
  };

  const PrevClick = () => {
    setSelectedWoodIndex((prev) => (prev - 1 + woods.length) % woods.length);
  };

  const selectedWoodData = woods[selectedWoodIndex];

  return (
    <div className="border-1 border-slate-400 p-4">
      <p className="text-center text-2xl font-bold">SELECT WOOD</p>
      <div className="flex flex-wrap gap-4 items-center justify-center pb-4">
        {woods.map((wood, index) => (
          <p
            key={wood._id}
            onClick={() => handleWoodClick(index)}
            className={`border-2 border-black px-4 py-1 rounded cursor-pointer ${
              selectedWoodIndex === index
                ? "text-xl font-bold underline"
                : "hover:text-xl"
            }`}
          >
            {wood.name}
          </p>
        ))}
      </div>

      {selectedWoodData && (
        <div className="relative flex justify-center items-center max-w-[70%] h-[45vh] min-h-[30vh] mb-4 mx-auto">
          <img
            className="w-full h-full object-cover opacity-100"
            onClick={handleImageNav}
            src={selectedWoodData.images[0]} // Display the first image
            alt={selectedWoodData.name}
          />
          <div className="absolute bottom-0 left-0 w-full h-[50%] flex flex-row justify-center items-center bg-gray-200 bg-opacity-75 text-black p-4">
            <div className="flex-1">
              <p className="text-2xl font-bold">{selectedWoodData.name}</p>
              <p className="text-lg">{selectedWoodData.description}</p>
              <p className="text-lg">
                No. of products: {productCount(selectedWoodData._id)}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold">Advantages</p>
              <ul className="list-disc list-inside">
                {selectedWoodData.advantages.map((advantage, index) => (
                  <li key={index}>{advantage}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-75 p-2 rounded-full"
            onClick={PrevClick}
          >
            <FaArrowLeft />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-75 p-2 rounded-full"
            onClick={NextClick}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default WoodDisplay;
