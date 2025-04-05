import React from 'react'
import logo from "../assets/logo.PNG";
import google from "../assets/google.PNG";
import apple from "../assets/apple.PNG";

const Signup = () => {
        return (
          <div className="flex items-center justify-center min-h-screen bg-black px-6">
            <div className="w-full max-w-sm text-center">
              <img
                src={logo}
                alt="Logo"
                className="w-20 mx-auto mb-6"
              />
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 mb-4 text-white bg-gray-800 rounded-lg focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 mb-4 text-white bg-gray-800 rounded-lg focus:outline-none"
              />
              <input
                type="password"
                placeholder="Re-enter password"
                className="w-full p-3 mb-4 text-white bg-gray-800 rounded-lg focus:outline-none"
              />
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg mb-4">
                Sign Up
              </button>
              {/* <p className="text-gray-400 text-sm mb-4">Forgot your password?</p> */}
              <button className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg mb-2">
                <img src={google} alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg mb-6">
                <img src={apple} alt="Apple" className="w-7 h-7 mr-2" />
                Continue with Apple
              </button>
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-red-500">Login</a>
              </p>
              <p className="text-gray-600 text-xs mt-4">by Elphreo</p>
            </div>
          </div>
        );
};

export default Signup