// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            Alumni Connect
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/news" className="hover:text-indigo-200">
              News
            </Link>
            <Link to="/jobs" className="hover:text-indigo-200">
              Jobs
            </Link>
            <Link to="/events" className="hover:text-indigo-200">
              Events
            </Link>
            <Link to="/contact" className="hover:text-indigo-200">
              Contact
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-indigo-200">
                  <span>{user.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100">
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="hover:text-indigo-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link to="/news" className="block hover:text-indigo-200">
              News
            </Link>
            <Link to="/jobs" className="block hover:text-indigo-200">
              Jobs
            </Link>
            <Link to="/events" className="block hover:text-indigo-200">
              Events
            </Link>
            <Link to="/contact" className="block hover:text-indigo-200">
              Contact
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="block hover:text-indigo-200">
                  Profile
                </Link>
                <Link to="/dashboard" className="block hover:text-indigo-200">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:text-indigo-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-indigo-500">
                <Link to="/login" className="block hover:text-indigo-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-100 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
