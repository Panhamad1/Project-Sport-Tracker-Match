import { Link } from 'react-router-dom';
import { FaFutbol, FaHome, FaTv, FaTrophy, FaUsers, FaChartBar } from 'react-icons/fa';

const NavigationBar = () => {
  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/live', label: 'Live Scores', icon: <FaTv /> },
    { path: '/results', label: 'Results', icon: <FaTrophy /> },
    { path: '/teams', label: 'Teams', icon: <FaUsers /> },
    { path: '/stats', label: 'Statistics', icon: <FaChartBar /> },
  ];

  return (
    <nav className="border-b border-[#2a2a2a] bg-[#050505] px-4 md:px-8 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2">
          <FaFutbol className="text-2xl text-[#8b5cf6]" />
          <h1 className="text-white text-xl font-bold">FootHub</h1>
        </div>

        <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className="flex items-center gap-2 text-gray-400 hover:text-[#8b5cf6] transition-colors">
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;