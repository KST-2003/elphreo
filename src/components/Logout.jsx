import React from "react";
import useAuthStore from "../store/useAuthStore.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      clearToken(); // Clear token from Zustand and localStorage
      navigate("/login");  // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <button className="px-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
