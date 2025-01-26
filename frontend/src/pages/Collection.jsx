import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext"; // Assuming ShopContext is defined
import Title from "../components/Title";
import axios from "axios";

const Collection = () => {
  const { backendUrl, navigate } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/all`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter and sort products
  const filterAndSortProducts = () => {
    let filteredProducts = [...products];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.category.name)
      );
    }

    // Apply sorting
    if (sortType === "low-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    return filteredProducts;
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center gap-2">
          FILTERS
        </p>

        {/* Category Filter */}
        <div className="border border-gray-300 pl-5 py-3">
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm">
            {categories.map((category) => (
              <label key={category._id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  className="w-3"
                  value={category.name}
                  onChange={() => handleCategoryChange(category.name)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        {/* Product Sort for small screens */}
        <div className="mt-6 md:mt-0 md:hidden">
          <select
            className="border-2 border-gray-300 text-sm px-2 w-full"
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
        {filterAndSortProducts().length > 0 ? (
  filterAndSortProducts().map((product) => (
    <div
      key={product._id}
      onClick={() => showProduct(product._id)}
      className="border p-4 rounded-md shadow-md w-full max-w-[300px] cursor-pointer"
    >
      <img
        src={product.image[0]}
        alt={product.name}
        className="w-full h-48 object-cover mb-4"
      />
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-700">{product.description}</p>
      <p className="text-gray-900 font-semibold">${product.price}</p>
    </div>
  ))
) : (
  <p className="text-center text-gray-500">No products found for the selected categories.</p>
)}

        </div>
      </div>
    </div>
  );
};

export default Collection;
