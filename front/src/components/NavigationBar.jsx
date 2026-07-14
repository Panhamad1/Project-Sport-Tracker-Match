import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaBell,
  FaChartLine,
  FaChevronDown,
  FaCrown,
  FaFutbol,
  FaHeart,
  FaHome,
  FaNewspaper,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaThumbtack,
  FaTrophy,
  FaTv,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getNotifications, markAllNotificationsRead } from '../api/football/NotificationApi';
import SearchDropdown from './SearchDropdown';

const NavigationBar = ({ onToggleSidebar, isExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const notificationMenuRef = useRef(null);

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const mobileLinks = [
    { path: '/home', label: 'Home', icon: <FaHome /> },
    { path: '/leagues', label: 'Leagues', icon: <FaCrown /> },
    { path: '/matches', label: 'Matches', icon: <FaTv /> },
    { path: '/leaderboard', label: 'Ranks', icon: <FaTrophy /> },
    { path: '/prediction', label: 'Picks', icon: <FaChartLine /> },
    { path: '/dream-team', label: 'Dream Team', icon: <FaUsers /> },
    { path: '/news', label: 'News', icon: <FaNewspaper /> },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: <FaShieldAlt /> }] : []),
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  const loadNotifications = useCallback(async () => {
    if(!isAuthenticated){
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setNotificationLoading(true);
    const result = await getNotifications();

    if(result.ok){
      setNotifications(result.data?.notifications || []);
      setUnreadCount(result.data?.unread_count || 0);
    }

    setNotificationLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadNotifications();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadNotifications]);

  useEffect(() => {
    window.addEventListener('notifications-updated', loadNotifications);

    return () => {
      window.removeEventListener('notifications-updated', loadNotifications);
    };
  }, [loadNotifications]);

  useEffect(() => {
    if(!isNotificationOpen){
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if(notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)){
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('touchstart', closeOnOutsideClick);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('touchstart', closeOnOutsideClick);
    };
  }, [isNotificationOpen]);

  const handleToggleNotifications = async () => {
    const nextOpen = !isNotificationOpen;
    setIsNotificationOpen(nextOpen);
    setIsProfileMenuOpen(false);

    if(nextOpen){
      await loadNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsRead();

    if(result.ok){
      setUnreadCount(0);
      setNotifications((current) => current.map((notification) => ({
        ...notification,
        is_read: true,
      })));
      window.dispatchEvent(new Event('notifications-updated'));
    }
  };

  const handleLogout = () => {
    logout();
    closeProfileMenu();
    setIsNotificationOpen(false);
    navigate('/login');
  };

  return (
    <nav className="border-b border-[#2a2a2a] bg-[#050505] sticky top-0 z-50">
      <div className="max-w-full px-3 py-3 sm:px-4 md:px-12 md:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="hidden p-2 text-gray-400 transition-all hover:bg-[#1a1a1a] hover:text-white md:inline-flex md:rounded-lg"
              onClick={onToggleSidebar}
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <FaBars className="text-xl" />
            </button>

            <Link to="/home" className="flex items-center gap-2 group">
              <FaFutbol className="text-2xl text-[#8b5cf6] group-hover:scale-110 transition-transform" />
              <h1 className="text-white text-lg font-bold sm:text-xl">
                Foot<span className="text-[#8b5cf6]">Hub</span>
              </h1>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl hidden lg:flex">
            <SearchDropdown />
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-4">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((current) => !current)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
            >
              <FaSearch className="text-lg" />
            </button>

            {isAuthenticated && (
              <div ref={notificationMenuRef} className="relative">
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  className="relative inline-flex rounded-lg p-2 text-gray-400 transition-all hover:bg-[#1a1a1a] hover:text-white"
                >
                  <FaBell className="text-lg" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] shadow-xl">
                    <div className="flex items-center justify-between gap-3 border-b border-[#2a2a2a] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Notifications</p>
                        <p className="text-xs text-gray-500">{unreadCount} unread</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-xs font-medium text-[#a78bfa] hover:text-white"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto p-2">
                      {notificationLoading ? (
                        <p className="px-3 py-4 text-sm text-gray-400">Loading notifications...</p>
                      ) : notifications.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-[#2a2a2a] px-3 py-4 text-sm text-gray-400">
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.slice(0, 6).map((notification) => (
                          <Link
                            key={notification.notification_id}
                            to={notification.match?.api_fixture_id ? `/matches/${notification.match.api_fixture_id}` : '/profile/notifications'}
                            onClick={() => setIsNotificationOpen(false)}
                            className={`mb-2 block rounded-lg border p-3 transition-all hover:border-[#8b5cf6]/50 ${
                              notification.is_read
                                ? 'border-[#2a2a2a] bg-[#111111]'
                                : 'border-[#8b5cf6]/30 bg-[#8b5cf6]/10'
                            }`}
                          >
                            <p className="text-sm font-semibold text-white">{notification.title}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-gray-400">{notification.message}</p>
                          </Link>
                        ))
                      )}
                    </div>

                    <Link
                      to="/profile/notifications"
                      onClick={() => setIsNotificationOpen(false)}
                      className="block border-t border-[#2a2a2a] px-4 py-3 text-center text-sm font-medium text-[#a78bfa] hover:text-white"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((current) => !current)}
                  className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-2.5 py-2 transition-all hover:bg-[#2a2a2a] sm:px-3"
                >
                  <FaUserCircle className="text-2xl text-[#8b5cf6]" />
                  <span className="text-white text-sm hidden lg:inline">{user.username || 'Profile'}</span>
                  <FaChevronDown className={`text-gray-500 text-xs transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] shadow-xl">
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
                      <Link onClick={closeProfileMenu} to="/profile/notifications" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a]">
                        <FaBell className="text-[#8b5cf6]" />
                        Notifications
                      </Link>
                      <Link onClick={closeProfileMenu} to="/dream-team" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a]">
                        <FaUsers className="text-[#8b5cf6]" />
                        Dream Team
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
              <Link to="/login" className="rounded-lg bg-[#8b5cf6] px-3 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed] sm:px-4">
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

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {mobileLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-all ${
                isActive(link.path)
                  ? 'border-[#8b5cf6]/50 bg-[#8b5cf6]/20 text-white'
                  : 'border-[#2a2a2a] bg-[#101010] text-gray-400'
              }`}
            >
              <span className="text-sm">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
