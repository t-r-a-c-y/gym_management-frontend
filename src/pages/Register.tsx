
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "lucide-react";

const Register = () => {
  // Branch form state
  const [branchName, setBranchName] = useState("");
  const [branchEmail, setBranchEmail] = useState("");
  const [branchLocation, setBranchLocation] = useState("");
  
  // User form state
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("ADMIN"); // Default role
  
  // Form errors
  const [errors, setErrors] = useState<{
    branchName?: string;
    branchEmail?: string;
    branchLocation?: string;
    userEmail?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { register, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: {
      branchName?: string;
      branchEmail?: string;
      branchLocation?: string;
      userEmail?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    // Validate branch fields
    if (!branchName) {
      newErrors.branchName = "Branch name is required";
      isValid = false;
    }

    if (!branchEmail) {
      newErrors.branchEmail = "Branch email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(branchEmail)) {
      newErrors.branchEmail = "Email is invalid";
      isValid = false;
    }

    if (!branchLocation) {
      newErrors.branchLocation = "Branch location is required";
      isValid = false;
    }

    // Validate user fields
    if (!userEmail) {
      newErrors.userEmail = "User email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.userEmail = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const branchData = {
          name: branchName,
          email: branchEmail,
          location: branchLocation
        };
        
        const userData = {
          email: userEmail,
          password: password,
          role: role
        };
        
        await register(branchData, userData);
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-6">
          <h2 className="text-xl font-bold text-white">Register</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Branch Information</h3>
                
                <div className="mb-4">
                  <label htmlFor="branchName" className="block text-gray-700 font-medium mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    id="branchName"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.branchName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter branch name"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.branchName && (
                    <p className="text-red-500 text-sm mt-1">{errors.branchName}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="branchEmail" className="block text-gray-700 font-medium mb-2">
                    Branch Email
                  </label>
                  <input
                    type="email"
                    id="branchEmail"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.branchEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter branch email"
                    value={branchEmail}
                    onChange={(e) => setBranchEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.branchEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.branchEmail}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="branchLocation" className="block text-gray-700 font-medium mb-2">
                    Branch Location
                  </label>
                  <input
                    type="text"
                    id="branchLocation"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.branchLocation ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter branch location"
                    value={branchLocation}
                    onChange={(e) => setBranchLocation(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.branchLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.branchLocation}</p>
                  )}
                </div>
              </div>
              
              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">User Information</h3>
                
                <div className="mb-4">
                  <label htmlFor="userEmail" className="block text-gray-700 font-medium mb-2">
                    User Email
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.userEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter user email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.userEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.userEmail}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                    User Role
                  </label>
                  <select
                    id="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="TRAINER">Trainer</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2 h-4 w-4" />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
