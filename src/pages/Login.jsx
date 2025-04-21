import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.PNG';
import google from '../assets/google.PNG';
import apple from '../assets/apple.PNG';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { user, login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('[Login] User authenticated, redirecting');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('[Login] Submitting:', { email });

    try {
      await login(email, password);
      console.log('[Login] Login successful');
      navigate('/');
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to connect to server';
      console.error('[Login] Error:', message, status);

      if (status === 401) {
        setError('Invalid email or password');
      } else if (status === 419) {
        setError('Session expired, please try again');
      } else if (status === 422) {
        setError('Validation failed. Please check your input.');
      } else {
        setError(message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-6">
      <div className="w-full max-w-sm text-center">
        <img src={logo} alt="Logo" className="w-20 mx-auto mb-6" />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
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
        <p className="text-gray-400 text-sm mb-4">
          <a href="/forgot-password" className="text-red-500">
            Forgot your password?
          </a>
        </p>
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
          <a href="/signup" className="text-red-500">
            Sign Up
          </a>
        </p>
        <p className="text-gray-600 text-xs mt-4">by Elphreo</p>
      </div>
    </div>
  );
};

export default Login;