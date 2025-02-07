import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return (
    <AdminContext.Provider value={{ token, setToken, navigate, backendUrl }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
