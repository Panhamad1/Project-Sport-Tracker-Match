import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTv, FaSignOutAlt, FaSignInAlt, FaCog, FaQuestionCircle, FaTrophy, FaCrown, FaExchangeAlt, FaArrowRight, FaChartLine, FaNewspaper, FaUserCircle } from 'react-icons/fa';

const SideBar = ({ isExpanded }) => {
    const location = useLocation();
    const isAuthenticated = false;

    const sidebarLinks = [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/leagues', label: 'Leagues', icon: <FaCrown /> },
        { path: '/matches', label: 'Matches', icon: <FaTv /> },
        { path: '/compare', label: 'Compare', icon: <FaExchangeAlt /> },
        { path: '/leaderboard', label: 'Leaderboard', icon: <FaTrophy /> },
        { path: '/prediction', label: 'Predictions', icon: <FaChartLine /> },
        { path: '/news', label: 'News', icon: <FaNewspaper /> },
        { path: '/profile', label: 'Profile', icon: <FaUserCircle /> },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <aside className={`bg-[#050505] border-r border-[#2a2a2a] min-h-[calc(100vh-80px)] flex flex-col transition-all duration-300 ${isExpanded ? 'sm:w-48 md:w-56 lg:w-64' : 'sm:w-14 md:w-16 lg:w-20'}`}>
            <nav className={`flex-1 flex flex-col overflow-hidden ${!isExpanded && 'p-4'}`}>
                <ul className={`space-y-1 shrink-0 flex flex-col justify-center ${isExpanded && 'm-4'}`}>
                    {sidebarLinks.map((link) => (
                        <li key={link.path}>
                            <Link to={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(link.path) ? 'text-white bg-[#8b5cf6]/20 border border-[#8b5cf6]/30' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'} ${!isExpanded && 'justify-center'}`} title={!isExpanded ? link.label : ''}>
                                <span className="text-lg min-w-5">{link.icon}</span>
                                {isExpanded && <span className="text-sm">{link.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex-1 min-h-2"></div>

                <div className={`space-y-1 shrink-0 flex flex-col justify-center mb-4 ${isExpanded && 'm-4'}`}>
                    <Link to="/settings" className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all duration-200 text-sm ${!isExpanded && 'justify-center mb-px'}`} title={!isExpanded ? 'Settings & Privacy' : ''}>
                        <FaCog className="text-lg shrink-0" />
                        {isExpanded && <span className="whitespace-nowrap">Settings & Privacy</span>}
                    </Link>
                    <Link to="/help" className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all duration-200 text-sm ${!isExpanded && 'justify-center mb-px'}`} title={!isExpanded ? 'Help & Support' : ''}>
                        <FaQuestionCircle className="text-lg shrink-0" />
                        {isExpanded && <span className="whitespace-nowrap">Help & Support</span>}
                    </Link>
                </div>

                <div className="shrink-0">
                    <div className="border-t border-[#2a2a2a]"></div>
                </div>

                <div className={`shrink-0 h-13 flex justify-center items-center ${isExpanded ? 'p-4' : '-mb-4'}`}>
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group ${!isExpanded && 'justify-center'}`} title={!isExpanded ? 'Logout' : ''}>
                            <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform shrink-0" />
                            {isExpanded && (
                                <>
                                    <span className="text-sm">Logout</span>
                                    <FaArrowRight className="text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </>
                            )}
                        </button>
                    ) : (
                        <Link to="/login" className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all duration-200 group ${!isExpanded && 'justify-center'}`} title={!isExpanded ? 'Login' : ''}>
                            <FaSignInAlt className="text-lg group-hover:scale-110 transition-transform shrink-0" />
                            {isExpanded && (
                                <>
                                    <span className="text-sm">Login</span>
                                    <FaArrowRight className="text-sm ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </Link>
                    )}
                </div>
            </nav>

            <div className="shrink-0 h-13 flex items-center justify-center border-t border-[#2a2a2a]">
                {isExpanded && (
                    <p className="text-gray-600 text-xs text-center">FootHub v1.0</p>
                )}
            </div>
        </aside>
    );
};

export default SideBar;