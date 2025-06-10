
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCircle, Calendar } from "lucide-react";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import { useApi } from "../hooks/useApi";
import { dashboardService } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, error, refetch } = useApi<{ branches: number; users: number; workouts: number }>({
    method: "GET",
    url: "/dashboard",
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [error]);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your Gym Management Dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="cursor-pointer" 
            onClick={() => handleCardClick("/branches")}
          >
            <DashboardCard 
              title="Branches" 
              value={isLoading ? "Loading..." : stats?.branches || 0} 
              icon={<Users size={24} />}
              className="border-l-4 border-blue-500"
            />
          </div>
          <div 
            className="cursor-pointer" 
            onClick={() => handleCardClick("/users")}
          >
            <DashboardCard 
              title="Users" 
              value={isLoading ? "Loading..." : stats?.users || 0} 
              icon={<UserCircle size={24} />}
              className="border-l-4 border-indigo-500"
            />
          </div>
          <div 
            className="cursor-pointer" 
            onClick={() => handleCardClick("/workouts")}
          >
            <DashboardCard 
              title="Workouts" 
              value={isLoading ? "Loading..." : stats?.workouts || 0} 
              icon={<Calendar size={24} />}
              className="border-l-4 border-purple-500"
            />
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/branches")}
                className="py-3 px-4 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <Users size={18} /> View Branches
              </button>
              <button
                onClick={() => navigate("/users")}
                className="py-3 px-4 bg-indigo-100 text-indigo-700 font-medium rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
              >
                <UserCircle size={18} /> Manage Users
              </button>
              <button
                onClick={() => navigate("/workouts")}
                className="py-3 px-4 bg-purple-100 text-purple-700 font-medium rounded-md hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar size={18} /> Track Workouts
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">System Overview</h2>
            <button
              onClick={() => refetch()}
              className="text-blue-600 hover:text-blue-800"
            >
              Refresh Data
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Active Users Today</h3>
              <p className="text-2xl font-bold">{Math.floor(Math.random() * 50) + 10}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Workouts Logged Today</h3>
              <p className="text-2xl font-bold">{Math.floor(Math.random() * 30) + 5}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
