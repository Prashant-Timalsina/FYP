import React from "react";

const Login = () => {
  return (
    <div>
      <h1 className="text-center">Login</h1>
      <form>
        <div className="flex">
          <label className="flex flex-col px-4">
            First Name
            <input
              className="border rounded px-4 w-[100%]"
              type="text"
              placeholder="Write your name"
            />
          </label>
          <label className="flex flex-col">
            Last Name
            <input
              className="border rounded px-4 w-[100%]"
              type="text"
              placeholder="Write your name"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default Login;
