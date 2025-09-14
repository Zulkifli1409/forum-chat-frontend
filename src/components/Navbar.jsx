import { Link, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isAdminOrHigher =
    user && ["moderator", "admin", "super-admin"].includes(user.role);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const NavLink = ({ to, children, className = "", onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`
          relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
          ${
            isActive
              ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/50"
          }
          ${className}
        `}
      >
        {children}
        {isActive && (
          <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        )}
      </Link>
    );
  };

  const MobileNavLink = ({ to, children, className = "", onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`
          block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300
          ${
            isActive
              ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/50"
          }
          ${className}
        `}
      >
        {children}
      </Link>
    );
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-700/50"
              : "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/30 dark:bg-gray-900/95 dark:border-gray-700/30"
          }
        `}
        ref={menuRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to={user ? "/chat" : "/login"}
                className="group flex items-center space-x-2 flex-shrink-0"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FORTEK
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2">
              {user && (
                <NavLink to="/chat">
                  <span className="flex items-center space-x-2">💬 Chat</span>
                </NavLink>
              )}

              {isAdminOrHigher && (
                <NavLink to="/admin">
                  <span className="flex items-center space-x-2">
                    📊 Dashboard
                  </span>
                </NavLink>
              )}

              {user && (
                <NavLink
                  to={isAdminOrHigher ? "/admin-private" : "/chat-admin"}
                >
                  <span className="flex items-center space-x-2">
                    {isAdminOrHigher ? "🔒 Private Chat" : "👮 Chat Admin"}
                  </span>
                </NavLink>
              )}

              {/* Sponsorship link */}
              <NavLink to="/sponsorship">
                <span className="flex items-center space-x-2">
                  💡 Sponsorship
                </span>
              </NavLink>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>

              {/* Desktop User Section */}
              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                {!user ? (
                  <>
                    <button
                      onClick={toggleTheme}
                      className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 text-lg"
                    >
                      {theme === "light" ? "🌙" : "☀️"}
                    </button>
                    <NavLink to="/login">Login</NavLink>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={toggleTheme}
                      className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 text-lg"
                    >
                      {theme === "light" ? "🌙" : "☀️"}
                    </button>
                    <NotificationBell />
                    <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.alias?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Hi, <span className="font-semibold">{user.alias}</span>
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
          lg:hidden transition-all duration-300 overflow-hidden
          ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 dark:bg-gray-900/95 dark:border-gray-700/50">
            {user ? (
              <>
                <MobileNavLink to="/chat" onClick={() => setIsMenuOpen(false)}>
                  💬 Chat
                </MobileNavLink>

                {isAdminOrHigher && (
                  <MobileNavLink
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📊 Dashboard
                  </MobileNavLink>
                )}

                <MobileNavLink
                  to={isAdminOrHigher ? "/admin-private" : "/chat-admin"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {isAdminOrHigher ? "🔒 Private Chat" : "👮 Chat Admin"}
                </MobileNavLink>

                {/* Sponsorship Mobile */}
                <MobileNavLink
                  to="/sponsorship"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💡 Sponsorship
                </MobileNavLink>

                <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-4 pt-4">
                  <button
                    onClick={logout}
                    className="w-full flex justify-center bg-red-50 text-red-600 px-4 py-3 rounded-xl text-base font-medium dark:bg-red-900/20 dark:text-red-400"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </MobileNavLink>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl text-base font-medium transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16" />
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
