import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboard = () => (
  <div className="flex">
    <AdminSidebar />
    <div className="flex-1 flex flex-col">
      <AdminHeader />
      <main className="p-6">
        <h2 className="text-xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Total Users</h3>
            <p className="text-2xl">1,234</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Revenue</h3>
            <p className="text-2xl">$56,789</p>
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default AdminDashboard;