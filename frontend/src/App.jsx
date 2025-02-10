import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Product from "./pages/Product";
import CustomOrder from "./pages/CustomOrder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from "./components/Searchbar";
import Error from "./components/Error";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin w-16 h-16 text-primary" />
        </div>
      ) : (
        <>
          <Navbar />
          <Searchbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/custom-order" element={<CustomOrder />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/*" element={<Error />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
