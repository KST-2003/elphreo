const AdminHeader = () => (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Logout
      </button>
    </header>
  );
  
  export default AdminHeader;