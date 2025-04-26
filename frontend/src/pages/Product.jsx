import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets"; // Static assets like icons
import { toast } from "react-toastify";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const {
    addToCart,
    product,
    category,
    wood,
    fetchProductData,
    token,
    favorites,
    addToFavorites,
    removeFromFavorites,
  } = useContext(ShopContext);

  const { id } = useParams();
  const productId = String(id); // Ensure id is treated as a string

  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("related");

  // Fetch product details when id changes
  useEffect(() => {
    if (productId) {
      fetchProductData(productId);
    }
  }, [favorites, productId]); // Refetch product when favorites change

  // Set default image when product updates
  useEffect(() => {
    if (product?.image?.length) {
      setImage(product.image[0]);
    }
  }, [product]);

  // Check if product is in favorites
  const isFavorite = favorites.some((fav) => fav._id === productId);

  const handleToggleFavorite = async () => {
    if (!token) {
      toast.error("Please log in to manage favorites.");
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(productId, token);
        window.location.reload(); // Refresh page to update favorites
      } else {
        await addToFavorites(productId, token);
        window.location.reload(); // Refresh page to update favorites
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites.");
    }
  };

  return product ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {product.image?.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                alt={`Product image ${index + 1}`}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer hover:opacity-75 transition"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              alt={product.name}
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded text-white transition ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
          </button>

          <h1 className="font-medium text-2xl mt-2">{product.name}</h1>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={index < 4 ? assets.star_rated : assets.star_unrated}
                alt="star rating"
                className="w-3.5"
              />
            ))}
            <p className="pl-2">(122 Reviews)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">${product.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{product.description}</p>

          {/* Category & Wood Type */}
          <p className="mt-5 text-sm text-gray-500">
            Category: {category || "Not Specified"}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Wood: {wood || "Not Specified"}
          </p>

          {/* Dimensions */}
          <div className="flex gap-3 mt-5 mb-5 sm:w-4/5">
            <div className="flex flex-col gap-1">
              <p className="text-sm">Length:</p>
              <p className="text-sm">Breadth:</p>
              <p className="text-sm">Height:</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm">{product.length || "-"} cm</p>
              <p className="text-sm">{product.breadth || "-"} cm</p>
              <p className="text-sm">{product.height || "-"} cm</p>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() =>
              addToCart(
                product._id,
                product.length,
                product.breadth,
                product.height
              )
            }
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 rounded-md transition hover:bg-gray-800"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 flex flex-col gap-1 pt-2">
            <p>✅ 100% Original Product</p>
            <p>💰 Cash on delivery available</p>
          </div>
        </div>
      </div>

      {/* Related Products & Reviews Section */}
      <div className="mt-20">
        <div className="flex border-b">
          <button
            className={`border px-5 py-3 text-sm cursor-pointer ${
              activeTab === "related" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("related")}
          >
            Related Products
          </button>
          <button
            className={`border px-5 py-3 text-sm cursor-pointer ${
              activeTab === "reviews" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews (122)
          </button>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          {activeTab === "related" ? (
            <RelatedProducts
              category={category}
              wood={wood}
              currentProductId={id}
            />
          ) : (
            // <p>Placeholder for Related Products</p>
            // <p>Related products go here...(For now placeholder)</p>
            <p>Reviews go here...(For now placeholder)</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    // </div>
    <div className="flex justify-center items-center h-96 text-gray-600 text-lg">
      Loading product details...
    </div>
  );
};

export default Product;
