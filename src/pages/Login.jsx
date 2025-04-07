import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.PNG";
import google from "../assets/google.PNG";
import apple from "../assets/apple.PNG";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  setToken,
  getToken,
  removeToken,
  setJustLoggedIn,
  getJustLoggedIn,
  clearJustLoggedIn,
} from '../store/storage';

let hasRunAutoLogout = false; // Flag outside the component instance

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Custom logic to run only once when component is first initialized
  if (!hasRunAutoLogout) {
    hasRunAutoLogout = true;

    (async () => {
      const justLoggedIn = await getJustLoggedIn();

      if (justLoggedIn) {
        console.log("Skipping auto-logout — user just logged in.");
        await clearJustLoggedIn();
        return;
      }

      const token = await getToken();
      if (token) {
        try {
          await axios.post('http://127.0.0.1:8000/api/logout', null, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } catch (error) {
          console.error('Auto-logout failed:', error);
        } finally {
          await removeToken();
          console.log('Token removed on login screen');
        }
      }
    })();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const { token } = response.data;

      if (token) {
        await setToken(token);
        await setJustLoggedIn();
        console.log('Token set and just logged in flag set');
        navigate('/');
      } else {
        console.error('No token received');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
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
