import { Link, useLocation } from 'react-router-dom';
import {
  FaChartLine,
  FaCrown,
  FaFutbol,
  FaHome,
  FaNewspaper,
  FaShieldAlt,
  FaTrophy,
  FaTv,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const publicLinks = [
  { path: '/home', label: 'Home', icon: <FaHome /> },
  { path: '/leagues', label: 'Leagues', icon: <FaCrown /> },
  { path: '/matches', label: 'Matches', icon: <FaTv /> },
  { path: '/leaderboard', label: 'Leaderboard', icon: <FaTrophy /> },
  { path: '/prediction', label: 'Predictions', icon: <FaChartLine /> },
  { path: '/dream-team', label: 'Dream Team', icon: <FaUsers /> },
  { path: '/news', label: 'News', icon: <FaNewspaper /> },
];

const NavigationBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const accountLinks = user
    ? [
        { path: '/profile', label: 'Profile', icon: <FaUserCircle /> },
        ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: <FaShieldAlt /> }] : []),
      ]
    : [];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="border-b border-[#2a2a2a] bg-[#050505] px-4 py-5 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 xl:flex-row">
        <Link to="/home" className="flex items-center gap-2">
          <FaFutbol className="text-2xl text-[#8b5cf6]" />
          <h1 className="text-xl font-bold text-white">
            Foot<span className="text-[#8b5cf6]">Hub</span>
          </h1>
        </Link>

        <ul className="flex flex-wrap items-center justify-center gap-3 text-sm md:gap-5">
          {[...publicLinks, ...accountLinks].map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center gap-2 transition-colors ${
                  isActive(link.path)
                    ? 'text-[#a78bfa]'
                    : 'text-gray-400 hover:text-[#8b5cf6]'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden xl:block" />
      </div>
    </nav>
  );
};

export default NavigationBar;
