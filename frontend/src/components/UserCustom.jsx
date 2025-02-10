import React, { useContext } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const UserCustom = () => {
  const { navigate } = useContext(ShopContext);

  const toCustomOrder = () => {
    navigate("/custom-order");
  };
  return (
    <div>
      <div className="relative border h-[400px] max-h-[50vh] md:flex mt-6 mb-6">
        {/* Title */}
        <div className="relative flex justify-center items-center text-base sm:text-2xl mb-4 h-full bg-white bg-opacity-75 border border-white p-2 md:w-1/2 md:bg-transparent md:border-none">
          <div
            onClick={() => {
              toCustomOrder();
            }}
            className="cursor-pointer"
          >
            <Title text1={"CUSTOM"} text2={"ORDER"} />
          </div>
        </div>
        {/* Background Image */}
        <div className="absolute inset-0 md:relative md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Brown wooden table with chairs in a well-lit room"
            className="w-full h-full object-cover object-center object-bottom cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default UserCustom;
