const AdminSidebar = () => (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul>
        <li className="mb-2">
          <a href="/admin/dashboard" className="hover:text-gray-300">Dashboard</a>
        </li>
        <li className="mb-2">
          <a href="/admin/users" className="hover:text-gray-300">Users</a>
        </li>
      </ul>
    </div>
  );
  
  export default AdminSidebar;