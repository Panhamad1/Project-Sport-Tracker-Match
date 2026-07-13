import { Link } from 'react-router-dom';
import SocialButtons from './SocialButton';
import {
  FaEnvelope,
  FaFutbol,
  FaGlassCheers,
  FaMapMarkerAlt,
  FaPhone,
  FaTrophy,
} from 'react-icons/fa';

const quickLinks = [
  { path: '/home', label: 'Home' },
  { path: '/leagues', label: 'Leagues' },
  { path: '/matches', label: 'Matches' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/prediction', label: 'Predictions' },
  { path: '/dream-team', label: 'Dream Team' },
  { path: '/news', label: 'News' },
];

const leagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];

const Footer = () => {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#050505]">
      <div className="border-b border-[#2a2a2a] px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white sm:text-xl">Join Our Community</h3>
            <FaGlassCheers className="text-2xl text-[#8b5cf6] sm:text-3xl" />
          </div>
          <SocialButtons />
        </div>
      </div>

      <div className="px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 md:gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaFutbol className="text-2xl text-[#8b5cf6]" />
                <span className="text-xl font-bold text-white">FootHub</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Football scores, fixtures, predictions, and match details in one place.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#8b5cf6]">
                <FaTrophy />
                <span>Since 2024</span>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="inline-block text-sm text-gray-400 transition-colors duration-200 hover:text-[#8b5cf6]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
                Top Leagues
              </h4>
              <ul className="space-y-2">
                {leagues.map((league) => (
                  <li key={league}>
                    <Link
                      to="/leagues"
                      className="inline-block text-sm text-gray-400 transition-colors duration-200 hover:text-[#8b5cf6]"
                    >
                      {league}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <FaEnvelope className="text-[#8b5cf6]" />
                  <span>info@foothub.com</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <FaPhone className="text-[#8b5cf6]" />
                  <span>+855 0987654321</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <FaMapMarkerAlt className="text-[#8b5cf6]" />
                  <span>Phnom Penh, Cambodia</span>
                </li>
              </ul>

              <div className="mt-4">
                <p className="mb-2 text-xs text-gray-400">Subscribe to football updates</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="min-w-30 flex-1 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#8b5cf6] focus:outline-none"
                  />
                  <button className="whitespace-nowrap rounded-lg bg-linear-to-r from-[#8b5cf6] to-[#3b82f6] px-4 py-1.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-purple-500/20">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a] px-4 py-4 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-gray-500 md:flex-row">
          <span>© {new Date().getFullYear()} FootHub. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="transition-colors hover:text-[#8b5cf6]">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-[#8b5cf6]">Terms</Link>
            <Link to="/cookies" className="transition-colors hover:text-[#8b5cf6]">Cookies</Link>
            <Link to="/about" className="transition-colors hover:text-[#8b5cf6]">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
