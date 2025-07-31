import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">StoreTrack Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Log Out
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>Welcome to your dashboard! Your products and orders will appear here.</p>
        {/* TODO: Add product and order components here */}
      </div>
    </div>
  );
}