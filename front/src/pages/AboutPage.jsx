import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFutbol, FaUsers, FaTrophy, FaRocket, FaCheckCircle, FaEnvelope, FaPhone, FaHeart, FaShieldAlt, FaCode, FaStar, FaChartLine, FaSearch, FaListAlt } from 'react-icons/fa';

const AboutPage = () => {
    const highlights = [
        { icon: <FaFutbol className="text-3xl text-[#8b5cf6]" />, label: 'Live Scores', description: 'Real-time match updates' },
        { icon: <FaTrophy className="text-3xl text-yellow-400" />, label: 'Predictions', description: 'Compete with friends' },
        { icon: <FaUsers className="text-3xl text-green-400" />, label: 'Community', description: 'Leaderboard rankings' },
        { icon: <FaRocket className="text-3xl text-[#8b5cf6]" />, label: 'Fast & Reliable', description: 'Lightning-fast data' },
    ];

    const features = [
        { icon: <FaFutbol className="text-[#8b5cf6]" />, title: 'Match Fixtures', text: 'Browse football fixtures by date with Cambodia timezone support. See match status including NS, 1H, HT, FT, AET, and PEN in real time.' },
        { icon: <FaListAlt className="text-blue-400" />, title: 'Match Details', text: 'Dive deep into every match with overview, head-to-head records, prediction data, lineups, statistics, goal scorers, and live stream links.' },
        { icon: <FaChartLine className="text-green-400" />, title: 'League Standings', text: 'View complete league tables with team rankings, points, wins, draws, losses, and goal differences for all major leagues.' },
        { icon: <FaStar className="text-yellow-400" />, title: 'Predictions & Points', text: 'Make predictions on match outcomes and over/under goals before kickoff. Earn points based on odds accuracy and climb the leaderboard.' },
        { icon: <FaSearch className="text-orange-400" />, title: 'Smart Search', text: 'Search across teams, leagues, players, and matches all from one search bar. Find exactly what you\'re looking for instantly.' },
        { icon: <FaHeart className="text-red-400" />, title: 'Favorites & Pins', text: 'Save your favorite teams for quick access and pin important matches so you never miss a game that matters to you.' },
    ];

    const values = [
        { icon: <FaShieldAlt className="text-[#8b5cf6]" />, title: 'Data Accuracy', text: 'All football data is sourced from professional API providers and carefully synced into our database for reliable, consistent information.' },
        { icon: <FaRocket className="text-green-400" />, title: 'Performance First', text: 'Built with React, Vite, and a database-first architecture ensuring fast page loads. Users always read from our optimized MySQL database, never from slow external APIs.' },
        { icon: <FaHeart className="text-red-400" />, title: 'Built for Fans', text: 'Every feature is designed with football fans in mind. From dream team builders to prediction leaderboards, FootHub is made for people who love the beautiful game.' },
        { icon: <FaCode className="text-cyan-400" />, title: 'Modern Tech Stack', text: 'Powered by React and Vite on the frontend, Node.js and Express on the backend, with Sequelize ORM and MySQL for reliable data management.' },
    ];

    return (
        <div className="space-y-6 text-white">
            <div>
                <Link
                    to="/help"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#8b5cf6] transition-colors mb-4"
                >
                    <FaArrowLeft className="text-xs" />
                    Back to Help & Support
                </Link>
                <p className="text-sm font-medium text-[#8b5cf6]">About Us</p>
                <h1 className="mt-1 text-2xl font-bold">About FootHub</h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-400">
                    Your ultimate football tracking platform — built by fans, for fans.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {highlights.map((item, index) => (
                    <div key={index} className="text-center p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#8b5cf6]/30 transition-all group">
                        <div className="mx-auto mb-2">
                            {item.icon}
                        </div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaFutbol className="text-[#8b5cf6]" />
                    Who We Are
                </h2>
                <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
                    <p>
                        FootHub is a comprehensive football tracking platform designed for fans in Cambodia and beyond who want to stay connected with the world of football. We provide live scores, detailed match information, league standings, and interactive prediction features — all in one place.
                    </p>
                    <p>
                        Our platform operates on a database-first architecture, meaning all football data is professionally synced and stored in our system. This ensures fast, reliable access to match data without depending on slow external API calls for every page load.
                    </p>
                    <p>
                        Whether you're checking today's fixtures, analyzing head-to-head records, building your dream team lineup, or competing with friends on the prediction leaderboard, FootHub has everything you need to enhance your football experience.
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-green-400" />
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <div key={index} className="p-4 bg-[#2a2a2a]/50 rounded-lg">
                            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                                {feature.icon}
                                {feature.title}
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border border-[#8b5cf6]/30 bg-linear-to-br from-[#8b5cf6]/10 to-[#1a1a1a] p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaTrophy className="text-yellow-400" />
                    Our Mission
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                    To provide football enthusiasts with the most comprehensive, reliable, and user-friendly platform for tracking matches, making predictions, and engaging with the global football community. We believe every fan deserves access to accurate match data, real-time updates, and fun interactive features — all without the complexity of traditional sports platforms.
                </p>
            </div>

            <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    What Makes FootHub Different
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values.map((value, index) => (
                        <div key={index} className="p-4 bg-[#2a2a2a]/50 rounded-lg">
                            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                                {value.icon}
                                {value.title}
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{value.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaEnvelope className="text-[#8b5cf6]" />
                    Get In Touch
                </h2>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    Have questions, feedback, or suggestions? We'd love to hear from you. Our team is always working to improve FootHub and your input helps us build a better platform for everyone.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                    <a href="mailto:support@foothub.com" className="flex items-center gap-2 text-[#8b5cf6] hover:text-[#7c3aed] transition-colors">
                        <FaEnvelope className="text-xs" />
                        support@foothub.com
                    </a>
                    <span className="flex items-center gap-2 text-gray-400">
                        <FaPhone className="text-xs text-[#8b5cf6]" />
                        +855 0987654321
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Link to="/privacy" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Privacy Policy
                </Link>
                <Link to="/terms" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Terms of Service
                </Link>
                <Link to="/cookies" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Cookie Policy
                </Link>
            </div>
        </div>
    );
};

export default AboutPage;