import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.PNG";
import google from "../assets/google.PNG";
import apple from "../assets/apple.PNG";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { baseURL } from '../api/api';

const Login = () => {
  const { token, setToken, clearToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Capacitor Storage Helpers
  const setJustLoggedInFlag = async (value) => {
    console.log('[Storage] Setting justLoggedIn to:', value);
    await Preferences.set({ key: 'justLoggedIn', value: value.toString() });
  };

  const getJustLoggedInFlag = async () => {
    const { value } = await Preferences.get({ key: 'justLoggedIn' });
    console.log('[Storage] Fetched justLoggedIn value:', value);
    return value === 'true';
  };

  const removeJustLoggedInFlag = async () => {
    console.log('[Storage] Removing justLoggedIn flag');
    await Preferences.remove({ key: 'justLoggedIn' });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Login] handleSubmit triggered');
    console.log('[Login] Email:', email);
    console.log('[Login] Password:', password);

    try {
      const response = await axios.post(
        `${baseURL}/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const { token: newToken } = response.data;
      console.log('[Login] Login successful, token received:', newToken);

      await setToken(newToken);
      console.log('[Login] Token stored in Zustand and Capacitor');

      await setJustLoggedInFlag(true);
      console.log('[Login] justLoggedIn flag set to true');

      console.log('[Login] Navigating to /');
      navigate('/');
      console.log('[Login] Called navigate("/")');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error('[Login] Login failed:', errMsg);

      if (error.response?.status === 422) {
        console.log('[Login] Validation Errors:', error.response.data.errors);
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
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 text-white bg-gray-800 rounded-lg focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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