import { Link } from 'react-router-dom';
import { FaFutbol, FaHome, FaTv, FaUsers, FaUser, FaCrown, FaListOl, FaNewspaper, FaExchangeAlt, FaTrophy, FaChartLine, FaUserCircle, FaLock } from 'react-icons/fa';

const NavigationBar = () => {
    const isAuthenticated = false;

    const navLinks = [
        { path: '/', label: 'Home', icon: <FaHome />, public: true },
        { path: '/leagues', label: 'Leagues', icon: <FaCrown />, public: true },
        { path: '/matches', label: 'Matches', icon: <FaTv />, public: true },
        { path: '/standings', label: 'Standings', icon: <FaListOl />, public: true },
        { path: '/teams', label: 'Teams', icon: <FaUsers />, public: true },
        { path: '/players', label: 'Players', icon: <FaUser />, public: true },
        { path: '/compare', label: 'Compare', icon: <FaExchangeAlt />, public: true },
        { path: '/news', label: 'News', icon: <FaNewspaper />, public: true },
        { path: '/leaderboard', label: 'Leaderboard', icon: <FaTrophy />, public: false },
        { path: '/prediction', label: 'Predictions', icon: <FaChartLine />, public: false },
        { path: '/profile', label: 'Profile', icon: <FaUserCircle />, public: false },
    ];

    const visibleLinks = navLinks.filter(link => link.public || isAuthenticated);

    return (
        <nav className="border-b border-[#2a2a2a] bg-[#050505] px-4 md:px-8 py-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <FaFutbol className="text-2xl text-[#8b5cf6]" />
                    <h1 className="text-white text-xl font-bold">FootHub</h1>
                </div>
                <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
                    {visibleLinks.map((link) => {
                        const isLocked = !link.public && !isAuthenticated;

                        return (
                            <li key={link.path}>
                                {isLocked ? (
                                    <span className="flex items-center gap-2 text-gray-600 cursor-not-allowed" title="Please login to access this feature">
                                        <span className="text-base">{link.icon}</span>
                                        {link.label}
                                        <FaLock className="text-[10px] text-[#8b5cf6]/50" />
                                    </span>
                                ) : (
                                    <Link to={link.path} className="flex items-center gap-2 text-gray-400 hover:text-[#8b5cf6] transition-colors">
                                        <span className="text-base">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default NavigationBar;