import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../store/storage"; 

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Get token from Capacitor Storage
      const token = await getToken();

      if (token) {
        // Send logout request with token
        await axios.post(
          "http://127.0.0.1:8000/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Remove the token from Capacitor Storage after logout
        await removeToken();

        // Redirect to login page
        navigate("/login");
      } else {
        console.log("No token found.");
      }
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
