import React, { useContext } from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
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
import UpdateWood from "./pages/UpdateWood";
import ChatBox from "./pages/ChatBox";

export const currency = "$";

const ProtectedRoute = () => {
  const { token } = useContext(AdminContext);
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

const App = () => {
  const { token } = useContext(AdminContext);
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {!isLoginPage && <Navbar />}
      <hr />
      <div className="flex">
        {!isLoginPage && <Sidebar />}
        <div>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/add" element={<Add />} />
              <Route path="/updateProduct/:id" element={<UpdateProduct />} />
              <Route path="/updateCategory/:id" element={<UpdateCategory />} />
              <Route path="/updateWood/:id" element={<UpdateWood />} />
              <Route path="/addCategory" element={<AddCategory />} />
              <Route path="/addWood" element={<AddWood />} />
              <Route path="/list" element={<List />} />
              <Route path="/listuser" element={<UserList />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/chatbox" element={<ChatBox />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
