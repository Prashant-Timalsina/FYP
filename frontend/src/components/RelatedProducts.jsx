import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const RelatedProducts = ({ currentProductId }) => {
  const { backendUrl, currency } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [wood, setWood] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    // Fetch the current product details
    const fetchCurrentProduct = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/product/single/${currentProductId}`
        );
        if (response.data.success) {
          const currentProduct = response.data.product;

          setCategory(currentProduct.category);
          setWood(currentProduct.wood);

          fetchAllProducts();
        } else {
          toast.error("Failed to fetch current product data");
        }
      } catch (error) {
        toast.error("Failed to fetch current product");
        console.error(error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.data.success) {
          setAllProducts(response.data.products);
        } else {
          toast.error("Failed to fetch all products");
        }
      } catch (error) {
        toast.error("Failed to fetch all products");
        console.error(error);
      }
    };

    fetchCurrentProduct();
  }, [currentProductId]);

  useEffect(() => {
    if (category && wood && allProducts.length > 0) {
      const filteredProducts = allProducts.filter((product) => {
        const sameCategory = String(product.category) === String(category);
        const sameWood = String(product.wood) === String(wood);

        const isNotCurrent = product._id !== currentProductId;

        return isNotCurrent && (sameCategory || sameWood);
      });

      // Shuffle and select the top 5 products
      const shuffledProducts = shuffle(filteredProducts).slice(0, 6);
      setRelatedProducts(shuffledProducts);
    }
  }, [category, wood, allProducts, currentProductId]);

  const shuffle = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {relatedProducts.map((product) => {
          return (
            <div
              key={product._id}
              className="min-w-[200px] max-w-[200px] flex-shrink-0 p-4 border rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-md"
              />
              <h3 className="mt-2 text-sm font-medium">{product.name}</h3>
              <p className="text-gray-500 text-xs mt-1">
                {currency}
                {product.price}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
