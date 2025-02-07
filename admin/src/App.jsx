import React, { useContext } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import AddCategory from "./pages/AddCategory";
import AddWood from "./pages/AddWood";
import Product from "./pages/Product";
import UpdateProduct from "./pages/UpdateProduct";
import UpdateCategory from "./pages/UpdateCategory";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import UserList from "./pages/UserList";

export const currency = "$";

const ProtectedRoute = () => {
  const { token } = useContext(AdminContext);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  const { token } = useContext(AdminContext);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token ? <Navbar /> : null}
      <hr />
      <div className="flex">
        {token ? <Sidebar /> : null}
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<Add />} />
              <Route path="/updateProduct/:id" element={<UpdateProduct />} />
              <Route path="/updateCategory/:id" element={<UpdateCategory />} />
              <Route path="/addCategory" element={<AddCategory />} />
              <Route path="/addWood" element={<AddWood />} />
              <Route path="/list" element={<List />} />
              <Route path="/listuser" element={<UserList />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/product/:id" element={<Product />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
