import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import PrivateRoute from './PrivateRoute';
import useAuthStore from './store/useAuthStore';
import TestCors from './pages/TestCors';
import Places from './pages/Places';
import PlaceDetails from './pages/PlaceDetails';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import { Keyboard } from '@capacitor/keyboard';

function App() {
  const { init } = useAuthStore();

  useEffect(() => {
    const start = async () => {
      console.log('[App] Initializing auth store...');
      await init();
      console.log('[App] Finished auth store init');
    };
    start();

    // Only run Keyboard on native platforms
    // if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    //   Keyboard.setScroll({ isDisabled: true });
    // }
  }, [init]);

  return (
    <div className="min-h-screen pb-16">
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/places" element={<PrivateRoute><Places /></PrivateRoute>} />
        <Route path="/places/:placeID" element={<PrivateRoute><PlaceDetails /></PrivateRoute>} />
        <Route path="/restaurants" element={<PrivateRoute><Restaurants /></PrivateRoute>} /> 
         <Route path="/restaurants/:restaurantID" element={<PrivateRoute><RestaurantDetails /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/test" element={<TestCors />} />
        <Route path="/add" element={<div className="p-4">Add Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;