import { Link } from 'react-router-dom';
import { FaArrowRight, FaTrophy } from 'react-icons/fa';

const popularLeagues = [
    { id: 1, name: 'Premier League', country: 'England', logo: 'ENG', teams: 20 },
    { id: 2, name: 'La Liga', country: 'Spain', logo: 'ESP', teams: 20 },
    { id: 3, name: 'Bundesliga', country: 'Germany', logo: 'GER', teams: 18 },
    { id: 4, name: 'Serie A', country: 'Italy', logo: 'ITA', teams: 20 },
    { id: 5, name: 'Ligue 1', country: 'France', logo: 'FRA', teams: 18 },
    { id: 6, name: 'Champions League', country: 'Europe', logo: 'UCL', teams: 32 },
];

const PopularLeagues = () => {
    return (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#8b5cf6]/30">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <FaTrophy className="text-[#8b5cf6]" />
                    Popular Leagues
                </h3>
                <Link to="/leagues" className="flex items-center gap-1 text-xs text-[#8b5cf6] transition-colors hover:text-[#a78bfa]">
                    View All
                    <FaArrowRight className="text-[8px]" />
                </Link>
            </div>

            <div className="space-y-1.5">
                {popularLeagues.map((league) => (
                    <Link
                        key={league.id}
                        to={`/leagues/${league.name.toLowerCase().replace(/ /g, '-')}`}
                        className="group flex items-center justify-between rounded-lg p-2 transition-all duration-200 hover:bg-[#2a2a2a]"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="rounded-md bg-black/30 px-2 py-1 text-[10px] font-bold text-[#a78bfa]">{league.logo}</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-white transition-colors group-hover:text-[#8b5cf6]">{league.name}</span>
                                <span className="text-[9px] text-gray-500">{league.country} - {league.teams} teams</span>
                            </div>
                        </div>
                        <FaArrowRight className="text-[10px] text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-[#8b5cf6]" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PopularLeagues;
