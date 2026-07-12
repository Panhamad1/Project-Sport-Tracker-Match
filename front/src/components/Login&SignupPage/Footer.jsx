import { Link } from 'react-router-dom';
import SocialButtons from './SocialButton';
import { 
  FaGlassCheers, 
  FaFutbol, 
  FaTrophy, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

const Footer = () => {
  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/live', label: 'Live Scores' },
    { path: '/results', label: 'Results' },
    { path: '/stats', label: 'Statistics' },
    { path: '/about', label: 'About' },
  ];

  const leagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];

  return (
    <footer className="border-t border-[#2a2a2a] bg-[#050505]">
      <div className="border-b border-[#2a2a2a] px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-white text-lg sm:text-xl font-bold">Join Our Community</h3>
            <FaGlassCheers className="text-2xl sm:text-3xl text-[#8b5cf6] animate-bounce" />
          </div>
          <SocialButtons />
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 md:gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaFutbol className="text-2xl text-[#8b5cf6]" />
                <span className="text-white text-xl font-bold">FootHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your ultimate destination for live football scores and stats.
              </p>
              <div className="flex items-center gap-2 text-[#8b5cf6] text-sm">
                <FaTrophy />
                <span>Since 2024</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-gray-400 hover:text-[#8b5cf6] transition-colors text-sm hover:translate-x-1 inline-block duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Top Leagues
              </h4>
              <ul className="space-y-2">
                {leagues.map((league) => (
                  <li key={league}>
                    <Link 
                      to={`/league/${league.toLowerCase().replace(/ /g, '-')}`}
                      className="text-gray-400 hover:text-[#8b5cf6] transition-colors text-sm hover:translate-x-1 inline-block duration-200"
                    >
                      {league}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <FaEnvelope className="text-[#8b5cf6]" />
                  <span>info@foothub.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <FaPhone className="text-[#8b5cf6]" />
                  <span>+855 0987654321</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <FaMapMarkerAlt className="text-[#8b5cf6]" />
                  <span>Football City, FC 12345</span>
                </li>
              </ul>

              <div className="mt-4">
                <p className="text-gray-400 text-xs mb-2">Subscribe to our newsletter</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] transition-colors flex-1 min-w-30"
                  />
                  <button className="bg-linear-to-r from-[#8b5cf6] to-[#3b82f6] text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a] px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} FootHub. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-[#8b5cf6] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#8b5cf6] transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-[#8b5cf6] transition-colors">Cookies</Link>
            <Link to="/about" className="hover:text-[#8b5cf6] transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
