import { Link } from 'react-router-dom';
import { FaFutbol, FaUserCircle, FaSearch, FaBell, FaBars } from 'react-icons/fa';

const NavigationBar = ({ onToggleSidebar, isExpanded }) => {
  
  const isAuthenticated = true;
  const user = { name: 'Alex' };

  return (
    <nav className="border-b border-[#2a2a2a] bg-[#050505] sticky top-0 z-50">
      <div className="max-w-full px-4 md:px-12 py-4">
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 shrink-0">
            <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-all text-gray-400 hover:text-white"
              onClick={onToggleSidebar} title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
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
            <div className="relative w-full">
              <input type="text" placeholder="Search teams, players, matches..." className="w-full bg-[#1a1a1a] text-white text-sm rounded-lg px-4 py-2 pl-10 border border-[#2a2a2a] focus:border-[#8b5cf6] focus:outline-none transition-colors"/>
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all">
              <FaSearch className="text-lg" />
            </button>

            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all">
              <FaBell className="text-lg" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2 rounded-lg hover:bg-[#2a2a2a] transition-all">
                  <FaUserCircle className="text-2xl text-[#8b5cf6]" />
                  <span className="text-white text-sm hidden lg:inline">{user.name}</span>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg transition-all text-sm font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;