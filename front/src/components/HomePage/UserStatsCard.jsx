import { Link } from 'react-router-dom';
import { FaChartBar, FaChartLine, FaFire, FaMedal, FaTrophy } from 'react-icons/fa';

const userStats = {
    rank: 42,
    points: 2850,
    streak: 7,
    accuracy: 72,
    winRate: 68,
};

const UserStatsCard = () => {
    return (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#8b5cf6]/30 hover:shadow-lg hover:shadow-[#8b5cf6]/5">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center justify-center gap-2">
                    <FaChartBar className="text-base text-[#8b5cf6]" />
                    <h4 className="text-lg font-semibold text-white">Prediction Stats</h4>
                </div>

                <div className="flex gap-2 rounded-lg border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 p-1">
                    <span className="text-[10px] font-bold tracking-wider text-gray-400">Rank:</span>
                    <p className="text-[14px] font-bold leading-none text-[#8b5cf6]">#{userStats.rank}</p>
                </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-2">
                <div className="group cursor-default rounded-lg bg-[#2a2a2a] p-3 text-center transition-all duration-300 hover:bg-[#2a2a2a]/80">
                    <div className="flex items-center justify-center gap-1.5 text-[#8b5cf6]">
                        <FaTrophy className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Points</span>
                    </div>
                    <p className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-[#8b5cf6]">
                        {userStats.points}
                    </p>
                </div>

                <div className="group cursor-default rounded-lg bg-[#2a2a2a] p-3 text-center transition-all duration-300 hover:bg-[#2a2a2a]/80">
                    <div className="flex items-center justify-center gap-1.5 text-orange-400">
                        <FaFire className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Streak</span>
                    </div>
                    <p className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-orange-400">
                        {userStats.streak}
                    </p>
                </div>

                <div className="group cursor-default rounded-lg bg-[#2a2a2a] p-3 text-center transition-all duration-300 hover:bg-[#2a2a2a]/80">
                    <div className="flex items-center justify-center gap-1.5 text-green-400">
                        <FaChartLine className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Accuracy</span>
                    </div>
                    <p className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-green-400">
                        {userStats.accuracy}%
                    </p>
                </div>

                <div className="group cursor-default rounded-lg bg-[#2a2a2a] p-3 text-center transition-all duration-300 hover:bg-[#2a2a2a]/80">
                    <div className="flex items-center justify-center gap-1.5 text-blue-400">
                        <FaMedal className="text-xs" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Win Rate</span>
                    </div>
                    <p className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                        {userStats.winRate}%
                    </p>
                </div>
            </div>

            <div className="mb-3 border-t border-[#2a2a2a]"></div>

            <Link to="/prediction">
                <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#8b5cf6]/20 bg-gradient-to-r from-[#8b5cf6]/10 to-[#6d28d9]/10 py-1.5 text-xs font-medium text-[#8b5cf6] transition-all duration-300 hover:border-[#8b5cf6]/40 hover:from-[#8b5cf6]/20 hover:to-[#6d28d9]/20">
                    View Prediction Center
                </button>
            </Link>
        </div>
    );
};

export default UserStatsCard;
