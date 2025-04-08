import React from "react";
import useAuthStore from "../store/useAuthStore.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences"; // Import Capacitor Storage
import { baseURL } from '../api/api';

const Logout = () => {
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Fetch token from Capacitor Storage
      const { value: token } = await Preferences.get({ key: "token" });
      
      if (!token) {
        console.log("No token found, already logged out.");
        return;
      }

      // Send logout request to API
      await axios.post(`${baseURL}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear token from Zustand and Capacitor Storage
      clearToken(); // Clear token from Zustand store
      await Preferences.remove({ key: "token" }); // Clear token from Capacitor Storage

      navigate("/login");  // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <button
        className="px-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
