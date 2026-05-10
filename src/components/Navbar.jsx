import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-100/95 backdrop-blur-md shadow-lg' : 'bg-gray-100 shadow-md'
        }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 h-[64px] md:h-[80px]">

        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold text-red-700 whitespace-nowrap">
          🩸 Blood<span className="text-gray-900">Hive</span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8 text-base lg:text-lg font-medium">
          <Link
            to="/"
            className="cursor-pointer hover:text-red-600 transition duration-300"
          >
            Home
          </Link>

          <Link to="/featured" className="hover:text-red-600 transition duration-300">
            About Us
          </Link>

          <Link to="/contactus" className="hover:text-red-600 transition duration-300">
            Contact Us
          </Link>

          <Link to="/bloodbank" className="hover:text-red-600 transition duration-300">
            Blood Bank
          </Link>

          <Link to="/quiz" className="hover:text-red-600 transition duration-300">
            Quiz
          </Link>

          <Link to="/dashboard" className="hover:text-red-600 transition duration-300">
            Dashboard
          </Link>

          {user ? (
            <div className="flex items-center space-x-3 bg-white pl-2 pr-1 py-1 rounded-full border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-sm shadow-inner">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-gray-800 text-sm font-semibold max-w-[120px] truncate hidden sm:block">
                {user.name}
              </span>
              <div className="h-5 w-px bg-gray-300 mx-1 hidden sm:block"></div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <FiLogOut className="text-lg" />
              </button>
            </div>
          ) : (
            <Link
              to="/loginuser"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-semibold shadow-md active:scale-95"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl sm:text-3xl text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Overlay + Dropdown */}
      <div
        className={`md:hidden fixed inset-0 top-[64px] z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`relative bg-gray-100 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-y-0' : '-translate-y-4'
            }`}
        >
          <ul className="flex flex-col py-4">
            <li>
              <Link
                to="/"
                className="block px-6 py-3 text-lg font-medium text-gray-800 hover:text-red-600 hover:bg-red-50 transition duration-300 active:bg-red-100"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/featured"
                className="block px-6 py-3 text-lg font-medium text-gray-800 hover:text-red-600 hover:bg-red-50 transition duration-300 active:bg-red-100"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/contactus"
                className="block px-6 py-3 text-lg font-medium text-gray-800 hover:text-red-600 hover:bg-red-50 transition duration-300 active:bg-red-100"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </li>

            <li>
              <Link
                to="/bloodbank"
                className="block px-6 py-3 text-lg font-medium text-gray-800 hover:text-red-600 hover:bg-red-50 transition duration-300 active:bg-red-100"
                onClick={() => setIsOpen(false)}
              >
                Blood Bank
              </Link>
            </li>

            <li>
              <Link
                to="/quiz"
                className="block px-6 py-3 text-lg font-medium text-gray-800 hover:text-red-600 hover:bg-red-50 transition duration-300 active:bg-red-100"
                onClick={() => setIsOpen(false)}
              >
                Quiz
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard"
                className="block px-6 py-3 text-lg font-medium text-gray-800 hover:text-red-600 hover:bg-red-50 transition duration-300 active:bg-red-100"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </li>

            <li className="px-6 py-4 border-t border-gray-200 mt-2 bg-gray-50">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-lg shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Logged in</span>
                      <span className="text-gray-900 font-bold truncate max-w-[120px] sm:max-w-[160px]">{user.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center px-3 py-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors font-bold shadow-sm text-sm"
                  >
                    Logout <FiLogOut className="ml-2" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/loginuser"
                  className="flex justify-center w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-semibold shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Sign up
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
