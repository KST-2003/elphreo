import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <div className="min-h-screen pb-16"> {/* Padding for bottom navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search/>}/>
        <Route path="/add" element={<div className="p-4">Add Page</div>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;