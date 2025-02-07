import React from "react";
import Title from "../components/Title.jsx";
import { assets, products } from "../assets/assets.js";

const Orders = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 pt-10 border-t">
      {/* Left Side */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center gap-2">FILTERS</p>
        <div className="border border-gray-300 pl-5 py-3">
          <p className="mb-3 text-sm font-medium">ORDER STATE</p>
          <div className="flex flex-col gap-2">
            <label htmlFor="pending" className="flex gap-2 items-center">
              <input id="pending" type="checkbox" className="w-3" />
              Pending
            </label>
            <label htmlFor="cancelled" className="flex gap-2 items-center">
              <input id="cancelled" type="checkbox" className="w-3" />
              Cancelled
            </label>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1">
        <div className="flex flex-row md:flex-row justify-between text-base sm:text-2xl mb-4">
          <Title text1={"YOUR"} text2={"ORDERS"} />
        </div>

        {/* Orders List */}
        <div>
          {products.map((product, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-4 border-b pb-4 mb-4 last:border-b-0"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="font-bold text-lg">${product.price}</p>
                <p className="text-sm text-gray-500">
                  Category: {product.category}
                </p>
                <p className="text-sm text-gray-500">
                  Wood Type: {product.woodName}
                </p>
                <p className="text-sm text-gray-500">
                  Dimensions: {product.length}x{product.breadth}x
                  {product.height} cm
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <h2 className="bolder">Remaining Money</h2>
                <p>Current State</p>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

// import React from "react";
// import Title from "../components/Title.jsx";
// import { assets, products } from "../assets/assets.js";

// const Orders = () => {
//   return (
//     <div className="flex flex-col md:flex-row gap-4 pt-10 border-t">
//       {/* Left Side */}
//       <div className="min-w-60">
//         <p className="my-2 text-xl flex items-center gap-2">FILTERS</p>
//         <div className="border border-gray-300 pl-5 py-3">
//           <p className="mb-3 text-sm font-medium">ORDER STATE</p>
//           <div className="flex flex-col gap-2">
//             <label htmlFor="pending" className="flex gap-2 items-center">
//               <input id="pending" type="checkbox" className="w-3" />
//               Pending
//             </label>
//             <label htmlFor="cancelled" className="flex gap-2 items-center">
//               <input id="cancelled" type="checkbox" className="w-3" />
//               Cancelled
//             </label>
//           </div>
//         </div>
//       </div>
//       {/* Right Side */}
//       <div className="flex-1">
//         <div className="text-base sm:text-2xl mb-4">
//           <Title text1={"YOUR"} text2={"ORDERS"} />
//         </div>
//         {/* Orders List */}
//         <div>
//           {products.map((product, index) => (
//             <div
//               key={index}
//               className="flex flex-col md:flex-row items-center gap-4 border-b pb-4 mb-4 last:border-b-0"
//             >
//               <img
//                 src={product.images[0]}
//                 alt={product.name}
//                 className="w-24 h-24 object-cover rounded-lg"
//               />
// <div className="flex-1">
//   <h2 className="text-xl font-semibold">{product.name}</h2>
//   <p className="text-gray-600">{product.description}</p>
//   <p className="font-bold text-lg">${product.price}</p>
//   <p className="text-sm text-gray-500">
//     Category: {product.category}
//   </p>
//   <p className="text-sm text-gray-500">
//     Wood Type: {product.woodName}
//   </p>
//   <p className="text-sm text-gray-500">
//     Dimensions: {product.length}x{product.breadth}x
//     {product.height} cm
//   </p>
// </div>
// <div className="flex flex-col items-center gap-2">
//   <p>Current State</p>
//   <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
//     Cancel Order
//   </button>
// </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;
