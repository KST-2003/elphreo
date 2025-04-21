import { Link } from "react-router-dom";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { LiaUserCircleSolid } from "react-icons/lia";
import { LiaUtensilsSolid } from "react-icons/lia";
import { LiaBarsSolid } from "react-icons/lia";
import { LiaClipboardListSolid } from "react-icons/lia";
import { TiNews } from "react-icons/ti";
import { IoRestaurantSharp } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";

function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-4 pb-6">
      <Link to="/" className="text-gray-600 hover:text-black">
      <AiFillHome className="w-6 h-6"/>
      </Link>
      <Link to="/places" className="text-gray-600 hover:text-black">
        <LiaMapMarkedAltSolid className="w-7 h-7" />
      </Link>
      <Link to="/restaurants" className="text-gray-600 hover:text-black">
        <IoRestaurantSharp className="w-6 h-6"/>
      </Link>
      <Link to="/news" className="text-gray-600 hover:text-black">
        <TiNews className="w-6 h-7"/>
      </Link>
      <Link to="/profile" className="text-gray-600 hover:text-black">
        {/* <LiaUserCircleSolid /> */}
        <LiaBarsSolid className="w-7 h-7"/>
        {/* <LiaClipboardListSolid /> */}
      </Link>
    </nav>
  );
}

export default Navbar;