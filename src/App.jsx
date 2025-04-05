import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute

function App() {
  return (
    <div className="min-h-screen pb-16"> {/* Padding for bottom navbar */}
      <Routes>
        {/* Protected Route */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} /> } />
        
        {/* Public Routes */}
        <Route path="/search" element={<Search />} />
        <Route path="/add" element={<div className="p-4">Add Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;
