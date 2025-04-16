import React, { useEffect, useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";

const ProductListTable = () => {
  const { backendUrl, navigate, token, fetchCategory, fetchWood } =
    useContext(AdminContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryNames, setCategoryNames] = useState({});
  const [woodNames, setWoodNames] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list?page=1&limit=0`
      );
      const productsData = response.data.products;
      setProducts(productsData);

      // Fetch category and wood names for each product
      const categoryPromises = productsData.map((product) =>
        fetchCategory(product.category)
      );
      const woodPromises = productsData.map((product) =>
        fetchWood(product.wood)
      );

      const categoryResults = await Promise.all(categoryPromises);
      const woodResults = await Promise.all(woodPromises);

      // Create mapping of IDs to names
      const categoryMap = {};
      const woodMap = {};

      productsData.forEach((product, index) => {
        categoryMap[product.category] = categoryResults[index];
        woodMap[product.wood] = woodResults[index];
      });

      setCategoryNames(categoryMap);
      setWoodNames(woodMap);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleUpdateProduct = (id) => {
    navigate(`/updateProduct/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/product/remove/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== id)
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Wood
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Dimensions
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      onClick={() => handleShowProduct(product._id)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {categoryNames[product.category] || "Loading..."}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {woodNames[product.wood] || "Loading..."}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <p>L: {product.length}</p>
                      <p>B: {product.breadth}</p>
                      <p>H: {product.height}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleUpdateProduct(product._id)}
                        className="text-blue-600 hover:text-blue-800 block w-full text-left"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-800 block w-full text-left"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListTable;
