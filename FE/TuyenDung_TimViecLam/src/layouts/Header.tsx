import { useState, useEffect } from 'react';
import { ChevronDown, User, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getToken } from '../services/authService';
import { isTokenExpired } from '../utils/jwt';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      if (token) {
        if (isTokenExpired(token)) {
          logout();
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      }
    };

    checkToken();
    const intervalId = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">

          {/* Left: Logo */}
          <div className="flex items-center gap-8 xl:gap-12">
            {/* Logo */}
            <div className="flex flex-col justify-center cursor-pointer">
              <div className="text-[28px] font-black font-display tracking-tighter text-gray-800 leading-none">
                Up<span className="bg-linear-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Work</span>
              </div>
              <span className="text-[9px] text-gray-500 font-medium mt-0.5 hidden sm:block">
                Tiếp lợi thế - Nối thành công
              </span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Việc làm
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Hồ sơ CV
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Công ty
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Tin tức
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {isLoggedIn ? (
                <div
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-colors outline-none cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                      <User size={18} />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User size={16} />
                        Hồ sơ cá nhân
                      </Link>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-5 py-2 rounded-full border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-colors font-sans outline-none cursor-pointer"
                  >
                    Đăng ký
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity font-sans outline-none shadow-sm shadow-indigo-200 cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center ml-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2">
            <a href="#" className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors">
              Việc làm
              <ChevronDown size={18} className="text-gray-400" />
            </a>
            <a href="#" className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors">
              Hồ sơ CV
              <ChevronDown size={18} className="text-gray-400" />
            </a>
            <a href="#" className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors">
              Công ty
              <ChevronDown size={18} className="text-gray-400" />
            </a>
            <a href="#" className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors">
              Tin tức
              <ChevronDown size={18} className="text-gray-400" />
            </a>
          </nav>

          <div className="h-px bg-gray-100 mx-2 my-2"></div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 px-2 pb-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  Trang cá nhân
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <LogOut size={18} />
                  </div>
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-bold text-center hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  Đăng ký
                </button>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white font-bold text-center hover:opacity-90 transition-opacity shadow-sm shadow-indigo-200 cursor-pointer"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
