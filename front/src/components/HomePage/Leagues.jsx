import { FaTrophy } from 'react-icons/fa';

const Leagues = ({ selectedLeague, onSelectLeague }) => {
    const leagues = [
        'World Cup',
        'UEFA Euro',
        'Copa América',
        'Premier League',
        'La Liga',
        'Bundesliga',
        'Serie A',
        'Ligue 1',
        'Champions League',
        'Europa League',
        'FIFA Club World Cup',
    ];

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaTrophy className="text-[#8b5cf6]" />
                Leagues
            </h2>
            <div className="flex flex-wrap gap-3">
                {leagues.map((league) => (
                    <span key={league} onClick={() => onSelectLeague(league)} className={`px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${selectedLeague === league ? 'bg-[#8b5cf6] text-white' : 'bg-[#2a2a2a] hover:bg-[#8b5cf6]/20 hover:text-[#8b5cf6]'}`}>
                        {league}
                    </span>
                ))}
            </div>
            {selectedLeague !== 'All' && (
                <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
                    Filtering matches by: <span className="text-[#8b5cf6] font-semibold">{selectedLeague}</span>
                    <button onClick={() => onSelectLeague('All')} className="text-red-400 hover:text-red-300 transition-colors">✕ Clear</button>
                </div>
            )}
        </div>
    );
};

export default Leagues;