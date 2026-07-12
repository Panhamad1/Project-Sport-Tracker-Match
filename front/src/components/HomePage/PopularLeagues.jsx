import { FaTrophy, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PopularLeagues = () => {
    const popularLeagues = [
        { id: 1, name: 'Premier League', country: 'England', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', teams: 20 },
        { id: 2, name: 'La Liga', country: 'Spain', logo: '🇪🇸', teams: 20 },
        { id: 3, name: 'Bundesliga', country: 'Germany', logo: '🇩🇪', teams: 18 },
        { id: 4, name: 'Serie A', country: 'Italy', logo: '🇮🇹', teams: 20 },
        { id: 5, name: 'Ligue 1', country: 'France', logo: '🇫🇷', teams: 18 },
        { id: 6, name: 'Champions League', country: 'Europe', logo: '🏆', teams: 32 },
    ];

    return (
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] hover:border-[#8b5cf6]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <FaTrophy className="text-[#8b5cf6]" />
                    Popular Leagues
                </h3>
                <Link to="/leagues" className="text-xs text-[#8b5cf6] hover:text-[#7c3aed] transition-colors flex items-center gap-1">
                    View All
                    <FaArrowRight className="text-[8px]" />
                </Link>
            </div>

            <div className="space-y-1.5">
                {popularLeagues.map((league) => (
                    <Link 
                        key={league.id}
                        to={`/leagues/${league.name.toLowerCase().replace(/ /g, '-')}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#2a2a2a] transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="text-lg">{league.logo}</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-white group-hover:text-[#8b5cf6] transition-colors">{league.name}</span>
                                <span className="text-[9px] text-gray-500">{league.country} • {league.teams} teams</span>
                            </div>
                        </div>
                        <FaArrowRight className="text-[10px] text-gray-600 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PopularLeagues;