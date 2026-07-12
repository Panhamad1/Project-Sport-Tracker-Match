import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';

const matches = [
    { id: 1, league: 'World Cup', home: { name: 'France', logo: 'FRA' }, away: { name: 'Argentina', logo: 'ARG' }, score: '2 - 1', total: '3', time: '78:32', status: 'live', date: '2026-07-11' },
    { id: 2, league: 'World Cup', home: { name: 'Denmark', logo: 'DEN' }, away: { name: 'Tunisia', logo: 'TUN' }, score: '0 - 0', total: '0', time: 'FT', status: 'finished', date: '2026-07-11' },
    { id: 3, league: 'World Cup', home: { name: 'Brazil', logo: 'BRA' }, away: { name: 'Germany', logo: 'GER' }, score: '1 - 1', total: '2', time: '62:15', status: 'live', date: '2026-07-11' },
    { id: 4, league: 'World Cup', home: { name: 'Portugal', logo: 'POR' }, away: { name: 'Uruguay', logo: 'URU' }, score: '2 - 0', total: '2', time: 'FT', status: 'finished', date: '2026-07-10' },
    { id: 5, league: 'Premier League', home: { name: 'Liverpool', logo: 'LIV' }, away: { name: 'Arsenal', logo: 'ARS' }, score: '2 - 2', total: '4', time: 'FT', status: 'finished', date: '2026-07-10' },
    { id: 6, league: 'Premier League', home: { name: 'Man City', logo: 'MCI' }, away: { name: 'Chelsea', logo: 'CHE' }, score: '-', total: '-', time: '15:30', status: 'upcoming', date: '2026-07-12' },
    { id: 7, league: 'Champions League', home: { name: 'Real Madrid', logo: 'RMA' }, away: { name: 'Bayern Munich', logo: 'BAY' }, score: '3 - 0', total: '3', time: 'FT', status: 'finished', date: '2026-07-10' },
    { id: 8, league: 'Champions League', home: { name: 'AC Milan', logo: 'MIL' }, away: { name: 'Liverpool', logo: 'LIV' }, score: '1 - 2', total: '3', time: 'FT', status: 'finished', date: '2026-07-11' },
    { id: 9, league: 'Champions League', home: { name: 'Barcelona', logo: 'BAR' }, away: { name: 'Inter Milan', logo: 'INT' }, score: '-', total: '-', time: '20:45', status: 'upcoming', date: '2026-07-12' },
    { id: 10, league: 'La Liga', home: { name: 'Barcelona', logo: 'BAR' }, away: { name: 'Real Madrid', logo: 'RMA' }, score: '1 - 1', total: '2', time: 'FT', status: 'finished', date: '2026-07-11' },
    { id: 11, league: 'Bundesliga', home: { name: 'Bayern Munich', logo: 'BAY' }, away: { name: 'Dortmund', logo: 'BVB' }, score: '3 - 0', total: '3', time: 'FT', status: 'finished', date: '2026-07-10' },
    { id: 12, league: 'Europa League', home: { name: 'Man United', logo: 'MUN' }, away: { name: 'Sevilla', logo: 'SEV' }, score: '-', total: '-', time: '17:30', status: 'upcoming', date: '2026-07-12' },
];

const tabs = ['Live', 'Upcoming', 'Finished'];

const formatDateLabel = (date) => {
    const matchDate = new Date(`${date}T00:00:00`);
    return matchDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
};

const getStatusBadge = (status) => {
    if (status === 'live') {
        return (
            <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400"></span>
                Live
            </span>
        );
    }

    if (status === 'finished') {
        return (
            <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] font-semibold text-green-400">
                <FaCheckCircle className="text-[10px]" />
                Finished
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[11px] font-semibold text-yellow-400">
            <FaClock className="text-[10px]" />
            Upcoming
        </span>
    );
};

const MatchList = () => {
    const [activeTab, setActiveTab] = useState('Live');

    const filteredMatches = useMemo(() => {
        return matches
            .filter((match) => match.status === activeTab.toLowerCase())
            .sort((a, b) => {
                const dateCompare = new Date(`${a.date}T${a.time === 'FT' ? '23:59' : a.time}`) - new Date(`${b.date}T${b.time === 'FT' ? '23:59' : b.time}`);
                return activeTab === 'Finished' ? -dateCompare : dateCompare;
            });
    }, [activeTab]);

    const groupedMatches = useMemo(() => {
        return filteredMatches.reduce((groups, match) => {
            const dateGroup = groups.find((group) => group.date === match.date);
            if (dateGroup) {
                dateGroup.matches.push(match);
                return groups;
            }

            return [...groups, { date: match.date, matches: [match] }];
        }, []);
    }, [filteredMatches]);

    return (
        <section className="rounded-lg border border-[#2a2a2a] bg-[#101010] p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#8b5cf6]" />
                        <h2 className="text-lg font-semibold">Match Feed</h2>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Switch between live, upcoming, and finished matches.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                activeTab === tab
                                    ? 'bg-[#8b5cf6] text-white'
                                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#8b5cf6]/15 hover:text-[#a78bfa]'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {groupedMatches.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#2a2a2a] p-8 text-center text-gray-400">
                    No matches available for this filter.
                </div>
            ) : (
                <div className="space-y-4">
                    {groupedMatches.map((group) => (
                        <div key={group.date} className="space-y-3">
                            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <span>{formatDateLabel(group.date)}</span>
                                <span className="h-px flex-1 bg-[#2a2a2a]"></span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {group.matches.map((match) => (
                                    <Link
                                        key={match.id}
                                        to={`/matches/${match.id}`}
                                        className="group rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-3 transition-all hover:border-[#8b5cf6]/40 hover:bg-[#202020]"
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <span className="truncate text-xs text-gray-400">{match.league}</span>
                                            {getStatusBadge(match.status)}
                                        </div>

                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                            <div className="min-w-0">
                                                <div className="mb-1.5 inline-flex rounded-md bg-black/30 px-2 py-0.5 text-[10px] font-semibold text-[#a78bfa]">
                                                    {match.home.logo}
                                                </div>
                                                <p className="truncate text-sm font-semibold text-white">{match.home.name}</p>
                                            </div>

                                            <div className="rounded-lg bg-black/35 px-3 py-1.5 text-center">
                                                <p className="text-base font-bold text-white">{match.score}</p>
                                                <p className="text-[10px] uppercase tracking-wide text-gray-500">{match.time}</p>
                                            </div>

                                            <div className="min-w-0 text-right">
                                                <div className="mb-1.5 inline-flex rounded-md bg-black/30 px-2 py-0.5 text-[10px] font-semibold text-[#a78bfa]">
                                                    {match.away.logo}
                                                </div>
                                                <p className="truncate text-sm font-semibold text-white">{match.away.name}</p>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between border-t border-[#2a2a2a] pt-2 text-[11px] text-gray-400">
                                            <span>{match.status === 'finished' ? `Total goals: ${match.total}` : `Kickoff: ${match.time}`}</span>
                                            <span className="text-[#8b5cf6] opacity-0 transition-opacity group-hover:opacity-100">Details</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MatchList;
