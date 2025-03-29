import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { assets } from "../assets/assets";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        toast.success("Login successful!");
        navigate("/home");
      } else {
        toast.error(res.data.message || "Login failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="E-mail"
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <img
                className="h-5 w-5"
                src={showPassword ? assets.show : assets.hide}
                alt={showPassword ? "Show password" : "Hide password"}
              />
            </button>
          </div>
          <button
            type="submit"
            className={`w-full bg-black text-white font-light px-4 py-2 mt-4 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
