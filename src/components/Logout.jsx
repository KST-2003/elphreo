// import React from 'react';
// import useAuthStore from '../store/useAuthStore';
// import { useNavigate } from 'react-router-dom';

// const Logout = () => {
//   const { logout } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       console.log('[Logout] Initiating logout');
//       await logout();
//       console.log('[Logout] Logout successful');
//       navigate('/login');
//     } catch (error) {
//       console.error('[Logout] Logout failed:', error.message);
//     }
//   };

//   return (
//     <div>
//       <button
//         className="px-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium"
//         onClick={handleLogout}
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Logout;













import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
  const { logout } = useAuthStore();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('[Logout] Initiating logout');
      setMessage(null);
      setError(null);
      const response = await logout();
      console.log('[Logout] Logout successful:', response);
      setMessage(response.message || 'Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('[Logout] Logout failed:', error.message);
      setError(error.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <div>
      <button
        className="px-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium"
        onClick={handleLogout}
      >
        Logout
      </button>
      {/* {message && <p className="mt-2 text-green-500">{message}</p>} */}
      {/* {error && <p className="mt-2 text-red-500">{error}</p>} */}
    </div>
  );
};

export default Logout;