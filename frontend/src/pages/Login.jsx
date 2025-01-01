import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const [currentState, SetCurrentState] = useState("Login");
  const { navigate } = useContext(ShopContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  const changeToHome = () => {
    navigate("/");
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border brder-gray-800"
          placeholder="Name"
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border brder-gray-800"
        placeholder="E-mail"
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border brder-gray-800"
        placeholder="Password"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p>Forgot Password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => SetCurrentState("SignUp")}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => SetCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>
      <button
        onClick={() => {
          changeToHome();
        }}
        className="bg-black text-white font-light px-8 py-2 mt-4"
      >
        {currentState === "Login" ? "Login" : "SignUp"}
      </button>
    </form>
  );
};

export default Login;
