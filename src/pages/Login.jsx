import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.PNG";
import google from "../assets/google.PNG";
import apple from "../assets/apple.PNG";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token, clearToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");

    const autoLogout = async () => {
      if (token && !justLoggedIn) {
        try {
          await axios.post("http://127.0.0.1:8000/api/logout", null, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
        } catch (error) {
          console.error("Error during auto-logout:", error);
        } finally {
          clearToken();
        }
      }

      // Always clear this flag after running
      sessionStorage.removeItem("justLoggedIn");
    };

    autoLogout();
  }, [token, clearToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      const { token } = response.data;
      console.log('Login successful:', token);

      setToken(token);

      // Prevent auto-logout after login
      sessionStorage.setItem("justLoggedIn", "true");
      console.log("Navigating...");
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);

      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        console.log('Validation Errors:', validationErrors);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-6">
      <div className="w-full max-w-sm text-center">
        <img src={logo} alt="Logo" className="w-20 mx-auto mb-6" />
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Username (Email)"
            className="w-full p-3 mb-4 text-white bg-gray-800 rounded-lg focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Update email state
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 text-white bg-gray-800 rounded-lg focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Update password state
          />
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg mb-4"
          >
            Sign In
          </button>
        </form>
        <p className="text-gray-400 text-sm mb-4">Forgot your password?</p>
        <button className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg mb-2">
          <img src={google} alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg mb-6">
          <img src={apple} alt="Apple" className="w-7 h-7 mr-2" />
          Continue with Apple
        </button>
        <p className="text-gray-500 text-sm">
          Don't have an account yet?{' '}
          <a href="/signup" className="text-red-500">Sign Up</a>
        </p>
        <p className="text-gray-600 text-xs mt-4">by Elphreo</p>
      </div>
    </div>
  );
};

export default Login;
