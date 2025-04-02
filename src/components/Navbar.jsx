import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-4 pb-6">
      <Link to="/" className="text-gray-600 hover:text-black">
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.87 8.14 6.84 9.46-.09-.83-.17-2.1 0-3 .94-5.06 2.5-8.5 2.5-8.5-1.66 0-3.06 1.66-3.06 3.06 0 1.66 1.25 2.5 2.5 2.5.83 0 1.66-.83 1.66-1.66 0-1.66-1.25-2.91-2.91-2.91-2.08 0-3.33 1.66-3.33 3.33 0 1.25.42 2.08 1.25 2.91.08.08.17.08.25.08.25 0 .42-.25.42-.58 0-.42-.17-1.25-.58-1.66-.42-.42-.83-.83-.83-1.66 0-1.25 1-2.5 2.5-2.5 1.25 0 2.5 1 2.5 2.5 0 1.66-1 3.33-2.5 3.33-.83 0-1.66-.42-1.66-1.25 0-1.25.83-2.5 2.5-2.5.42 0 .83.08 1.25.25.83-1.66 1.25-3.33 1.25-5-3.33 0-6 2.67-6 6 0 .83.17 1.66.5 2.5-.42 1.66-1.66 3.33-3.33 4.16 1.66 1 3.75 1.66 6 1.66 5.5 0 9.96-4.46 9.96-9.96 0-5.5-4.46-9.96-9.96-9.96z" />
        </svg>
      </Link>
      <Link to="/search" className="text-gray-600 hover:text-black">
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.5 3a7.5 7.5 0 015.96 12.28l4.53 4.53a1 1 0 01-1.42 1.42l-4.53-4.53A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
        </svg>
      </Link>
      <Link to="/add" className="text-gray-600 hover:text-black">
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" />
        </svg>
      </Link>
      <Link to="/login" className="text-gray-600 hover:text-black">
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </Link>
    </nav>
  );
}

export default Navbar;