import { Link } from 'react-router-dom';
import { FaArrowRight, FaTrophy } from 'react-icons/fa';

const leagues = [
    { id: 39, name: 'Premier League', country: 'England', season: 2024 },
    { id: 140, name: 'LaLiga', country: 'Spain', season: 2024 },
    { id: 307, name: 'Saudi Pro League', country: 'Saudi Arabia', season: 2024 },
    { id: 253, name: 'Major League Soccer', country: 'United States', season: 2024 },
];

const PopularLeagues = () => {
    return (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#8b5cf6]/30">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <FaTrophy className="text-[#8b5cf6]" />
                    Saved Leagues
                </h3>
                <Link to="/leagues" className="flex items-center gap-1 text-xs text-[#8b5cf6] transition-colors hover:text-[#a78bfa]">
                    View All
                    <FaArrowRight className="text-[8px]" />
                </Link>
            </div>

            <div className="space-y-1.5">
                {leagues.map((league) => (
                    <Link
                        key={league.id}
                        to={`/leagues?league=${league.id}&season=${league.season}`}
                        className="group flex items-center justify-between rounded-lg p-2 transition-all duration-200 hover:bg-[#2a2a2a]"
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            <span className="rounded-md bg-black/30 px-2 py-1 text-[10px] font-bold text-[#a78bfa]">{league.id}</span>
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-xs font-medium text-white transition-colors group-hover:text-[#8b5cf6]">{league.name}</span>
                                <span className="text-[9px] text-gray-500">{league.country} - Season {league.season}</span>
                            </div>
                        </div>
                        <FaArrowRight className="shrink-0 text-[10px] text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-[#8b5cf6]" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PopularLeagues;
