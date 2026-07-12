import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const MatchList = ({ selectedLeague = 'All', onMatchesUpdate }) => {
    const [activeTab, setActiveTab] = useState('Live');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const tabs = ['All', 'Live', 'Played', 'Upcoming'];

    const allMatches = [
        { id: 1, league: 'World Cup', type: 'country', group: 'Group A', home: { name: 'France', logo: '🇫🇷' }, away: { name: 'Argentina', logo: '🇦🇷' }, score: '2 - 1', total: '3', time: '78:32', status: 'live', date: '2026-07-11' },
        { id: 2, league: 'World Cup', type: 'country', group: 'Group A', home: { name: 'Denmark', logo: '🇩🇰' }, away: { name: 'Tunisia', logo: '🇹🇳' }, score: '0 - 0', total: '0', time: 'FT', status: 'played', date: '2026-07-11' },
        { id: 3, league: 'World Cup', type: 'country', group: 'Group B', home: { name: 'Brazil', logo: '🇧🇷' }, away: { name: 'Germany', logo: '🇩🇪' }, score: '1 - 1', total: '2', time: '62:15', status: 'played', date: '2026-07-11' },
        { id: 4, league: 'World Cup', type: 'country', group: 'Group B', home: { name: 'Portugal', logo: '🇵🇹' }, away: { name: 'Uruguay', logo: '🇺🇾' }, score: '2 - 0', total: '2', time: 'FT', status: 'played', date: '2026-07-10' },
        { id: 5, league: 'Premier League', type: 'club', group: null, home: { name: 'Liverpool', logo: '🔴' }, away: { name: 'Arsenal', logo: '🔴' }, score: '2 - 2', total: '4', time: 'FT', status: 'played', date: '2026-07-10' },
        { id: 6, league: 'Premier League', type: 'club', group: null, home: { name: 'Man City', logo: '🔵' }, away: { name: 'Chelsea', logo: '🔵' }, score: '-', total: '-', time: '15:30', status: 'upcoming', date: '2026-07-12' },
        { id: 7, league: 'Champions League', type: 'club', group: 'Group A', home: { name: 'Real Madrid', logo: '⚪' }, away: { name: 'Bayern Munich', logo: '🔴' }, score: '3 - 0', total: '3', time: 'FT', status: 'played', date: '2026-07-10' },
        { id: 8, league: 'Champions League', type: 'club', group: 'Group A', home: { name: 'AC Milan', logo: '🔴' }, away: { name: 'Liverpool', logo: '🔴' }, score: '1 - 2', total: '3', time: 'FT', status: 'played', date: '2026-07-11' },
        { id: 9, league: 'Champions League', type: 'club', group: 'Group B', home: { name: 'Barcelona', logo: '🔵' }, away: { name: 'Inter Milan', logo: '🔵' }, score: '-', total: '-', time: '20:45', status: 'upcoming', date: '2026-07-12' },
        { id: 10, league: 'La Liga', type: 'club', group: null, home: { name: 'Barcelona', logo: '🔵' }, away: { name: 'Real Madrid', logo: '⚪' }, score: '1 - 1', total: '2', time: 'FT', status: 'played', date: '2026-07-11' },
        { id: 11, league: 'Bundesliga', type: 'club', group: null, home: { name: 'Bayern Munich', logo: '🔴' }, away: { name: 'Dortmund', logo: '🟡' }, score: '3 - 0', total: '3', time: 'FT', status: 'played', date: '2026-07-10' },
        { id: 12, league: 'Europa League', type: 'club', group: null, home: { name: 'Man United', logo: '🔴' }, away: { name: 'Sevilla', logo: '⚪' }, score: '-', total: '-', time: '17:30', status: 'upcoming', date: '2026-07-12' },
    ];

    const getMostRecentMatchDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const matchesWithDates = allMatches.map(match => ({ ...match, dateObj: new Date(match.date) }));
        const sortedMatches = matchesWithDates.sort((a, b) => b.dateObj - a.dateObj);
        const mostRecent = sortedMatches.find(match => match.dateObj <= today);
        return mostRecent ? mostRecent.date : null;
    };

    const getMatchesForDate = (date) => {
        let dateStr;
        if (!date) {
            const mostRecentDate = getMostRecentMatchDate();
            if (!mostRecentDate) return [];
            dateStr = mostRecentDate;
        } else if (typeof date === 'string') {
            dateStr = date;
        } else {
            dateStr = date.toISOString().split('T')[0];
        }
        return allMatches.filter(match => match.date === dateStr);
    };

    const getFilteredMatches = () => {
        let dateMatches = getMatchesForDate(selectedDate);
        if (dateMatches.length === 0) {
            const mostRecentDate = getMostRecentMatchDate();
            if (mostRecentDate && mostRecentDate !== selectedDate.toISOString().split('T')[0]) {
                dateMatches = getMatchesForDate(mostRecentDate);
                if (dateMatches.length > 0) {
                    const [year, month, day] = mostRecentDate.split('-').map(Number);
                    const newDate = new Date(year, month - 1, day);
                    setSelectedDate(newDate);
                }
            }
        }
        let filtered = dateMatches;
        if (activeTab === 'Live') {
            filtered = dateMatches.filter(match => match.status === 'live');
        } else if (activeTab === 'Played') {
            filtered = dateMatches.filter(match => match.status === 'played');
        } else if (activeTab === 'Upcoming') {
            filtered = dateMatches.filter(match => match.status === 'upcoming');
        }
        if (selectedLeague !== 'All') {
            filtered = filtered.filter(match => match.league === selectedLeague);
        }
        return filtered;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'live':
                return (
                    <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                        Live
                    </span>
                );
            case 'played':
                return (
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded flex items-center gap-1">
                        <FaCheckCircle className="text-xs" />
                        Played
                    </span>
                );
            case 'upcoming':
                return (
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded flex items-center gap-1">
                        <FaClock className="text-xs" />
                        Upcoming
                    </span>
                );
            default:
                return null;
        }
    };

    const isFutureDate = selectedDate.getFullYear() > 2026;
    const filteredMatches = getFilteredMatches();

    useState(() => {
        if (onMatchesUpdate && filteredMatches.length > 0) {
            onMatchesUpdate({
                league: filteredMatches[0].league,
                type: filteredMatches[0].type,
                group: filteredMatches[0].group,
                matches: filteredMatches
            });
        }
    }, [filteredMatches]);

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 px-1">
                <div className="flex items-center justify-center gap-2">
                    <FaCalendarAlt className="text-[#8b5cf6]" />
                    <h2 className="text-lg font-semibold">Matches's Schedule</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1 rounded-lg text-sm transition-all ${activeTab === tab ? 'bg-[#8b5cf6] text-white' : 'bg-[#1a1a1a] hover:bg-[#8b5cf6]/20 hover:text-[#8b5cf6]'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span>Date: </span>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="bg-[#1a1a1a] text-white text-sm rounded-lg px-3 py-1.5 border border-[#2a2a2a] focus:border-[#8b5cf6] focus:outline-none transition-colors w-20"
                        calendarClassName="custom-calendar"
                        popperClassName="custom-popper"
                    />
                </div>
            </div>

            {isFutureDate ? (
                <div className="bg-[#1a1a1a] p-8 rounded-lg text-center">
                    <p className="text-gray-400">No matches scheduled for this date yet.</p>
                    <p className="text-gray-500 text-sm mt-1">Please select a different date.</p>
                </div>
            ) : filteredMatches.length === 0 ? (
                <div className="bg-[#1a1a1a] p-8 rounded-lg text-center">
                    <p className="text-gray-400">No {activeTab.toLowerCase()} matches {selectedLeague !== 'All' && ` for ${selectedLeague}`} on this date.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredMatches.map((match) => (
                        <div key={match.id} className="bg-[#1a1a1a] p-4 rounded-lg hover:bg-[#2a2a2a] transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-400">{match.league}</span>
                                {getStatusBadge(match.status)}
                            </div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex flex-col items-center gap-1 flex-1">
                                    <span className="text-4xl">{match.home.logo}</span>
                                    <span className="font-semibold text-sm text-center">{match.home.name}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500 font-bold">VS</span>
                                    <span className="text-lg font-bold text-[#8b5cf6]">{match.score}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 flex-1">
                                    <span className="text-4xl">{match.away.logo}</span>
                                    <span className="font-semibold text-sm text-center">{match.away.name}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-400 mt-2 pt-2 border-t border-[#2a2a2a] px-1">
                                <span>Match's time: {match.time}</span>
                                <span className="font-semibold text-white">Total score: {match.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchList;