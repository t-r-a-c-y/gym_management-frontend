
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">Thrive Gym</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`${isActive('/dashboard') ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/branches" 
                    className={`${isActive('/branches') ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Branches
                  </Link>
                  <Link 
                    to="/users" 
                    className={`${isActive('/users') ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Users
                  </Link>
                  <Link 
                    to="/workouts" 
                    className={`${isActive('/workouts') ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Workouts
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`${isActive('/profile') ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={logout} 
                    className="text-white hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`${isActive('/login') ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className={`${isActive('/register') ? 'bg-indigo-800 text-white' : 'text-white hover:bg-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 focus:outline-none"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'bg-indigo-700' : ''} text-white block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`${isActive('/dashboard') ? 'bg-indigo-700' : ''} text-white block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/branches" 
                  className={`${isActive('/branches') ? 'bg-indigo-700' : ''} text-white block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Branches
                </Link>
                <Link 
                  to="/users" 
                  className={`${isActive('/users') ? 'bg-indigo-700' : ''} text-white block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Users
                </Link>
                <Link 
                  to="/workouts" 
                  className={`${isActive('/workouts') ? 'bg-indigo-700' : ''} text-white block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Workouts
                </Link>
                <Link 
                  to="/profile" 
                  className={`${isActive('/profile') ? 'bg-indigo-700' : ''} text-white block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }} 
                  className="text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`${isActive('/login') ? 'bg-indigo-700' : ''} text-white block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`${isActive('/register') ? 'bg-indigo-700' : ''} text-white block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
