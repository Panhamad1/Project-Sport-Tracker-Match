import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaFutbol,
  FaHeart,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaThumbtack,
  FaUserCircle,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import SearchDropdown from './SearchDropdown';

const NavigationBar = ({ onToggleSidebar, isExpanded }) => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeProfileMenu();
    navigate('/login');
  };

  return (
    <nav className="border-b border-[#2a2a2a] bg-[#050505] sticky top-0 z-50">
      <div className="max-w-full px-4 md:px-12 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-all text-gray-400 hover:text-white"
              onClick={onToggleSidebar}
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <FaBars className="text-xl" />
            </button>

            <Link to="/home" className="flex items-center gap-2 group">
              <FaFutbol className="text-2xl text-[#8b5cf6] group-hover:scale-110 transition-transform" />
              <h1 className="text-white text-xl font-bold hidden sm:block">
                Foot<span className="text-[#8b5cf6]">Hub</span>
              </h1>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl hidden lg:flex">
            <SearchDropdown />
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((current) => !current)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
            >
              <FaSearch className="text-lg" />
            </button>

            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all">
              <FaBell className="text-lg" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((current) => !current)}
                  className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2 rounded-lg hover:bg-[#2a2a2a] transition-all"
                >
                  <FaUserCircle className="text-2xl text-[#8b5cf6]" />
                  <span className="text-white text-sm hidden lg:inline">{user.username || 'Profile'}</span>
                  <FaChevronDown className={`text-gray-500 text-xs transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#2a2a2a]">
                      <p className="text-white text-sm font-semibold truncate">{user.username}</p>
                      <p className="text-gray-500 text-xs truncate">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link onClick={closeProfileMenu} to="/profile" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a]">
                        <FaUserCircle className="text-[#8b5cf6]" />
                        Profile
                      </Link>
                      <Link onClick={closeProfileMenu} to="/profile/favorites" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a]">
                        <FaHeart className="text-[#8b5cf6]" />
                        Favorite Teams
                      </Link>
                      <Link onClick={closeProfileMenu} to="/profile/pinned" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a]">
                        <FaThumbtack className="text-[#8b5cf6]" />
                        Pinned Matches
                      </Link>
                      {isAdmin && (
                        <Link onClick={closeProfileMenu} to="/admin" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[#a78bfa] hover:text-white hover:bg-[#8b5cf6]/20">
                          <FaShieldAlt />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 border-t border-[#2a2a2a]"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg transition-all text-sm font-medium">
                {loading ? 'Loading...' : 'Sign In'}
              </Link>
            )}
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="mt-3 lg:hidden">
            <SearchDropdown />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
