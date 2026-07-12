import { FaTrophy, FaFire, FaChartLine, FaMedal, FaChartBar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserStatsCard = () => {
    // Sample user data - this would come from your API
    const userStats = {
        rank: 42,
        totalScore: 2850,
        weeklyScore: 420,
        streak: 7,
        bestStreak: 12,
        accuracy: 72,
        winRate: 68,
    };

    return (
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] hover:border-[#8b5cf6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#8b5cf6]/5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 items-center justify-center">
                    <FaChartBar className="text-[#8b5cf6] text-base" />
                    <h4 className="text-lg font-semibold text-white">Your Statistics</h4>
                </div>
                
                <div className="bg-[#8b5cf6]/10 p-1 rounded-lg border border-[#8b5cf6]/20 flex gap-2">
                    <span className="text-[10px] text-gray-400 tracking-wider font-bold">Rank:</span>
                    <p className="text-[14px] font-bold text-[#8b5cf6] leading-none">#{userStats.rank}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2 mb-3">
                <div className="bg-[#2a2a2a] rounded-lg p-3 text-center hover:bg-[#2a2a2a]/80 transition-all duration-300 group cursor-default">
                    <div className="flex items-center justify-center gap-1.5 text-[#8b5cf6]">
                        <FaTrophy className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Score</span>
                    </div>
                    <p className="text-lg font-bold text-white group-hover:text-[#8b5cf6] transition-colors duration-300">
                        {userStats.totalScore}
                    </p>
                </div>

                <div className="bg-[#2a2a2a] rounded-lg p-3 text-center hover:bg-[#2a2a2a]/80 transition-all duration-300 group cursor-default">
                    <div className="flex items-center justify-center gap-1.5 text-orange-400">
                        <FaFire className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Streak</span>
                    </div>
                    <p className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                        {userStats.streak}
                    </p>
                </div>

                <div className="bg-[#2a2a2a] rounded-lg p-3 text-center hover:bg-[#2a2a2a]/80 transition-all duration-300 group cursor-default">
                    <div className="flex items-center justify-center gap-1.5 text-green-400">
                        <FaChartLine className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Accuracy</span>
                    </div>
                    <p className="text-lg font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                        {userStats.accuracy}%
                    </p>
                </div>

                <div className="bg-[#2a2a2a] rounded-lg p-3 text-center hover:bg-[#2a2a2a]/80 transition-all duration-300 group cursor-default">
                    <div className="flex items-center justify-center gap-1.5 text-blue-400">
                        <FaMedal className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Win Rate</span>
                    </div>
                    <p className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {userStats.winRate}%
                    </p>
                </div>
            </div>

            <div className="border-t border-[#2a2a2a] mb-3"></div>

            <Link to="/profile/stats">
                <button className="w-full bg-linear-to-r from-[#8b5cf6]/10 to-[#6d28d9]/10 hover:from-[#8b5cf6]/20 hover:to-[#6d28d9]/20 text-[#8b5cf6] text-xs font-medium py-1.5 rounded-lg border border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 transition-all duration-300 flex items-center justify-center gap-1.5">
                    View Full Stats →
                </button>
            </Link>
        </div>
    );
};

export default UserStatsCard;