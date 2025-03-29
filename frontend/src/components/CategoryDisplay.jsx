import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const CategoryDisplay = () => {
  const { categories, products, navigate } = useContext(ShopContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategoryIndex(0);
    }
  }, [categories]);

  const productCount = (categoryId) => {
    return products.filter((product) => product.category === categoryId).length;
  };

  const handleCategoryClick = (index) => {
    setSelectedCategoryIndex(index);
  };

  const handleImageNav = () => {
    const selectedCategory = categories[selectedCategoryIndex].name;
    navigate(`/collection?category=${selectedCategory}`);
  };

  const NextClick = () => {
    setSelectedCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const PrevClick = () => {
    setSelectedCategoryIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
  };

  const selectedCategoryData = categories[selectedCategoryIndex];

  return (
    <div className="border-1 border-slate-400 p-4">
      <p className="text-center text-2xl font-bold">SELECT CATEGORY</p>
      <div className="flex flex-wrap gap-4 items-center justify-center pb-4">
        {categories.map((category, index) => (
          <p
            key={category._id}
            onClick={() => handleCategoryClick(index)}
            className={`border-2 border-black px-4 py-1 rounded cursor-pointer ${
              selectedCategoryIndex === index
                ? "text-xl font-bold underline"
                : "hover:text-xl"
            }`}
          >
            {category.name}
          </p>
        ))}
      </div>

      {selectedCategoryData && (
        <div className="relative flex justify-center items-center max-w-[70%] h-[45vh] min-h-[30vh] mb-4 mx-auto">
          <img
            className="w-full h-full object-cover opacity-90"
            onClick={handleImageNav}
            src={selectedCategoryData.image}
            alt={selectedCategoryData.name}
          />
          <div className="absolute bottom-0 left-0 w-full h-[30%] flex flex-col justify-center items-center bg-gray-200 bg-opacity-75 text-black p-4">
            <p className="text-2xl font-bold">{selectedCategoryData.name}</p>
            <p className="text-lg">{selectedCategoryData.description}</p>
            <p className="text-lg">
              No. of products: {productCount(selectedCategoryData._id)}
            </p>
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

export default CategoryDisplay;
