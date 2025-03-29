import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const RelatedProducts = ({ category, wood, currentProductId }) => {
  const { backendUrl } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchRelatedProducts = async (category, wood, currentProductId) => {
    try {
      console.log("🔄 Fetching related products for:", {
        category,
        wood,
        currentProductId,
      });

      const apiUrl = `${backendUrl}/api/product/related`;
      const queryParams = { category, wood };

      console.log("🔍 API Request:", apiUrl);
      console.log("📌 Query Parameters:", queryParams);

      const response = await axios.get(apiUrl, { params: queryParams });

      console.log("✅ API Response:", response.data);

      console.log("✅ API Response Received:", response.data);

      if (response.data.success) {
        const products = response.data.products;
        console.log("📦 All Fetched Products:", products);

        // Filter out the current product
        const filteredProducts = products.filter(
          (product) => product._id !== currentProductId
        );

        console.log(
          "🎯 Filtered Related Products (Excluding Current):",
          filteredProducts
        );

        // Shuffle and pick up to 5 products
        const shuffledProducts = filteredProducts.sort(
          () => Math.random() - 0.5
        );
        const finalProducts = shuffledProducts.slice(0, 5);

        console.log(
          "🎲 Shuffled and Selected Products (Top 5):",
          finalProducts
        );

        return finalProducts;
      } else {
        console.error(
          "❌ Error fetching related products:",
          response.data.message
        );
        toast.error("Failed to fetch related products");
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching related products:", error);
      toast.error("Failed to fetch related products");
      return [];
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("🔄 Fetching related products in useEffect...");

      const products = await fetchRelatedProducts(
        category,
        wood,
        currentProductId
      );

      console.log("✅ Received Related Products from API:", products);

      setRelatedProducts(products);
    };

    if (category || wood) {
      fetchProducts();
    }
  }, [category, wood, currentProductId, fetchRelatedProducts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {relatedProducts.length > 0 ? (
        relatedProducts.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="border p-3 rounded-md hover:shadow-md transition"
          >
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="mt-2 text-sm font-medium">{product.name}</h3>
            <p className="text-gray-500 text-xs">{product.category}</p>
            <p className="text-gray-500 text-xs">{product.wood}</p>
            <p className="text-lg font-bold mt-1">${product.price}</p>
          </Link>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          No related products found.
        </p>
      )}
    </div>
  );
};

export default RelatedProducts;
