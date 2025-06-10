
import { useEffect } from "react";
import Layout from "../components/Layout";
import { useApi } from "../hooks/useApi";
import { userService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { UserCircle, LogOut } from "lucide-react";

const Profile = () => {
  const { data: profile, isLoading, error } = useApi<string>({
    method: "GET",
    url: "/user/profile",
  });

  const { logout } = useAuth();

  useEffect(() => {
    if (error) {
      console.error("Error fetching profile:", error);
    }
  }, [error]);

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center justify-center">
              <div className="h-28 w-28 rounded-full bg-white/20 flex items-center justify-center text-white">
                <UserCircle size={64} />
              </div>
            </div>
            
            <div className="p-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h1>
              
              {isLoading ? (
                <div className="py-8">
                  <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto mt-4"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg my-4">
                  Failed to load profile data. Please try again.
                </div>
              ) : (
                <div className="py-8">
                  <p className="text-gray-600 text-lg">{profile}</p>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
