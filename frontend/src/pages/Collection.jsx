import React, { useEffect, useState } from "react";
import { products as initialProducts, assets } from "../assets/assets";
import Title from "../components/Title";

const Collection = () => {
  const [products, setProducts] = useState(initialProducts);
  const [sortType, setSortType] = useState("relevant");

  const sortProduct = () => {
    let sortedProducts = initialProducts.slice();

    switch (sortType) {
      case "low-high":
        setProducts(sortedProducts.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setProducts(sortedProducts.sort((a, b) => b.price - a.price));
        break;

      default:
        setProducts(initialProducts);
        break;
    }
  };

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col md:flex-row gap-1 md:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
          <img
            className="h-3 md:hidden rotate-[270deg]"
            src={assets.back}
            alt="dropdown icon"
          />
        </p>

        {/* Category Filter */}
        <div className="border border-gray-300 pl-5 py-3 mt-6 md:block">
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={"Furniture"} />{" "}
              Furniture
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={"Decor"} /> Decor
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={"Tools"} /> Tools
            </p>
          </div>
        </div>

        {/* Product Sort for small screens */}
        <div className="mt-6 md:mt-0 md:hidden">
          <select
            className="border-2 border-gray-300 text-sm px-2 w-full max-w-[200px]"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* Product Sort for medium and larger screens */}
          <div className="hidden md:block">
            <select
              className="border-2 border-gray-300 text-sm px-2 max-w-[400px]"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>

        {/* Map Products */}
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] place-items-center">
          {products.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-md shadow-md w-full min-w-[250px] max-w-[300px]"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-lg font-bold">{item.name}</h2>
              <p className="text-gray-700">{item.description}</p>
              <p className="text-gray-900 font-semibold">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
