import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const {
    navigate,
    categories,
    woods,
    products,
    currency,
    currentPage,
    totalPages,
    changePage,
  } = useContext(ShopContext);

  const [sortType, setSortType] = useState("relevant");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedWoods, setSelectedWoods] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  // const filterAndSortProducts = () => {
  //   let filteredProducts = [...products];

  //   console.log("Before filtering:", filteredProducts);
  //   console.log("Selected Categories:", selectedCategories);
  //   console.log("Selected Woods:", selectedWoods);

  //   if (selectedCategories.length > 0) {
  //     filteredProducts = filteredProducts.filter((product) => {
  //       console.log("Checking Category:", product.category); // Log category
  //       return (
  //         product.category &&
  //         selectedCategories.includes(product.category?.name)
  //       );
  //     });
  //   }

  //   if (selectedWoods.length > 0) {
  //     filteredProducts = filteredProducts.filter((product) => {
  //       console.log("Checking Wood:", product.wood); // Log wood
  //       return product.wood && selectedWoods.includes(product.wood?.name);
  //     });
  //   }

  //   console.log("After filtering:", filteredProducts);

  //   if (sortType === "low-high") {
  //     filteredProducts.sort((a, b) => a.price - b.price);
  //   } else if (sortType === "high-low") {
  //     filteredProducts.sort((a, b) => b.price - a.price);
  //   }

  //   setFilteredProducts(filteredProducts);
  // };

  const filterAndSortProducts = () => {
    let filteredProducts = [...products];

    // console.log("Before filtering:", filteredProducts);
    // console.log("Selected Categories:", selectedCategories);
    // console.log("Selected Woods:", selectedWoods);

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const categoryName = categories.find(
          (cat) => cat._id === product.category
        )?.name;
        // console.log("Checking Category Name:", categoryName);
        return categoryName && selectedCategories.includes(categoryName);
      });
    }

    if (selectedWoods.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const woodName = woods.find((wood) => wood._id === product.wood)?.name;
        // console.log("Checking Wood Name:", woodName);
        return woodName && selectedWoods.includes(woodName);
      });
    }

    // console.log("After filtering:", filteredProducts);

    if (sortType === "low-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filteredProducts);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    if (category) {
      setSelectedCategories([category]);
    }
  }, [location]);

  const handlePageChange = (page) => {
    changePage(page); // Update the current page using the context
  };

  useEffect(() => {
    console.log("Products:", products);
    filterAndSortProducts();
  }, [products, selectedCategories, selectedWoods, sortType]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleWoodChange = (wood) => {
    setSelectedWoods((prev) =>
      prev.includes(wood) ? prev.filter((w) => w !== wood) : [...prev, wood]
    );
  };

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row gap-4 pt-10 border-t"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Filter Options */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center gap-2">FILTERS</p>

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
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryChange(category.name)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        {/* Wood Filter */}
        <div className="border border-gray-300 pl-5 py-3 mt-4">
          <p className="mb-3 text-sm font-medium">WOODS</p>
          <div className="flex flex-col gap-2 text-sm">
            {woods.map((wood) => (
              <label key={wood._id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  className="w-3"
                  value={wood.name}
                  checked={selectedWoods.includes(wood.name)}
                  onChange={() => handleWoodChange(wood.name)}
                />
                {wood.name}
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

        {/* Products Grid */}
        <motion.div
          className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] place-items-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              // <motion.div
              //   key={product._id}
              //   onClick={() => showProduct(product._id)}
              //   className="border p-4 rounded-md shadow-md w-full max-w-[300px] cursor-pointer"
              //   initial={{ opacity: 0, y: 20, scale: 0.95 }}
              //   animate={{ opacity: 1, y: 0, scale: 1 }}
              //   transition={{ duration: 0.4, ease: "easeOut" }}
              // >
              //   <div className="overflow-hidden w-full h-48 relative">
              //     <motion.img
              //       src={product.image[0]}
              //       alt={product.name}
              //       className="w-full h-full object-cover"
              //       whileHover={{ scale: 1.1 }}
              //       transition={{ duration: 0.3 }}
              //     />
              //   </div>
              //   <h2 className="text-lg font-bold">{product.name}</h2>
              //   <p className="text-gray-700">{product.description}</p>
              //   <p className="text-gray-900 font-semibold">
              //     {currency}
              //     {product.price}
              //   </p>
              // </motion.div>

              <ProductItem
                key={product._id}
                id={product._id}
                image={product.image}
                name={product.name}
                description={product.description}
                price={product.price}
              />
            ))
          ) : (
            <motion.p
              className="text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No products found for the selected filter.
            </motion.p>
          )}
        </motion.div>
        {/* Pagination Controls */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Collection;
