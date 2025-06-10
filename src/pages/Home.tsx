
import { Link } from "react-router-dom";
import { Activity, Users, Calendar } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="animate-fadeIn">
        {/* Hero Section */}
        <div className="py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Thrive Gym Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            The complete solution for managing your gym branches, users, and tracking workouts
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-md hover:opacity-90 transition-opacity shadow-md"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
          
          {isAuthenticated && (
            <div className="flex justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-md hover:opacity-90 transition-opacity shadow-md"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
        
        {/* Features Section */}
        <div className="py-16 bg-gray-100 rounded-2xl">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Branch Management</h3>
                <p className="text-gray-600">
                  Efficiently manage multiple gym locations with our intuitive branch management system.
                  Track branches, assign staff, and monitor performance across locations.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">User Management</h3>
                <p className="text-gray-600">
                  Handle user registrations, track member details, and assign appropriate roles
                  with our comprehensive user management features.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex p-3 rounded-full bg-purple-100 text-purple-600">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Workout Tracking</h3>
                <p className="text-gray-600">
                  Keep track of different workout types, durations, and progress. 
                  Provide valuable insights for both trainers and members.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonial Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Trusted by Gym Owners Everywhere
            </h2>
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto border-l-4 border-indigo-600">
              <p className="text-gray-600 italic mb-4">
                "Thrive Gym Management has revolutionized how we manage our multiple locations. 
                The user interface is intuitive, and the workout tracking features have helped us 
                better serve our clients. Highly recommended!"
              </p>
              <p className="font-semibold">- Sarah Johnson, Fitness Center Owner</p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your gym management?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of gym owners who've streamlined their operations with our platform
          </p>
          
          {!isAuthenticated && (
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-gray-100 transition-colors shadow-md"
            >
              Get Started Today
            </Link>
          )}
          
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-gray-100 transition-colors shadow-md"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
