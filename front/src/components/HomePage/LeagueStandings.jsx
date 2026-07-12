import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCrown, FaArrowRight } from 'react-icons/fa';

const LeagueStandings = ({ selectedLeague = 'All', matchData = null }) => {
    const [activeGroup, setActiveGroup] = useState('Group A');
    const [userSelectedGroup, setUserSelectedGroup] = useState(null);

    // Sample standings data - this would come from your API
    const allStandings = {
        'World Cup': {
            type: 'country',
            groups: {
                'Group A': [
                    { rank: 1, team: 'France', logo: '🇫🇷', mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7, status: 'Advanced' },
                    { rank: 2, team: 'Argentina', logo: '🇦🇷', mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6, status: 'Advanced' },
                    { rank: 3, team: 'Denmark', logo: '🇩🇰', mp: 3, w: 1, d: 1, l: 1, gf: 3, ga: 4, gd: -1, pts: 4, status: 'Eliminated' },
                    { rank: 4, team: 'Tunisia', logo: '🇹🇳', mp: 3, w: 0, d: 0, l: 3, gf: 1, ga: 6, gd: -5, pts: 0, status: 'Eliminated' },
                ],
                'Group B': [
                    { rank: 1, team: 'Brazil', logo: '🇧🇷', mp: 3, w: 2, d: 1, l: 0, gf: 7, ga: 2, gd: 5, pts: 7, status: 'Advanced' },
                    { rank: 2, team: 'Germany', logo: '🇩🇪', mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6, status: 'Advanced' },
                    { rank: 3, team: 'Portugal', logo: '🇵🇹', mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3, status: 'Eliminated' },
                    { rank: 4, team: 'Uruguay', logo: '🇺🇾', mp: 3, w: 0, d: 1, l: 2, gf: 2, ga: 7, gd: -5, pts: 1, status: 'Eliminated' },
                ],
            }
        },
        'Champions League': {
            type: 'club',
            groups: {
                'Group A': [
                    { rank: 1, team: 'Real Madrid', logo: '⚪', mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7, status: 'Advanced' },
                    { rank: 2, team: 'Liverpool', logo: '🔴', mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6, status: 'Playoffs' },
                    { rank: 3, team: 'AC Milan', logo: '🔴', mp: 3, w: 1, d: 1, l: 1, gf: 3, ga: 4, gd: -1, pts: 4, status: 'Eliminated' },
                    { rank: 4, team: 'Bayern Munich', logo: '🔴', mp: 3, w: 0, d: 0, l: 3, gf: 1, ga: 6, gd: -5, pts: 0, status: 'Eliminated' },
                ],
                'Group B': [
                    { rank: 1, team: 'Barcelona', logo: '🔵', mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7, status: 'Advanced' },
                    { rank: 2, team: 'Inter Milan', logo: '🔵', mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6, status: 'Playoffs' },
                    { rank: 3, team: 'Dortmund', logo: '🟡', mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3, status: 'Eliminated' },
                    { rank: 4, team: 'Sevilla', logo: '⚪', mp: 3, w: 0, d: 1, l: 2, gf: 2, ga: 7, gd: -5, pts: 1, status: 'Eliminated' },
                ],
            }
        },
        'Premier League': {
            type: 'club',
            groups: null,
            standings: [
                { rank: 1, team: 'Liverpool', logo: '🔴', mp: 10, w: 8, d: 1, l: 1, gf: 25, ga: 11, gd: 14, pts: 25, status: 'Advanced' },
                { rank: 2, team: 'Man City', logo: '🔵', mp: 10, w: 7, d: 2, l: 1, gf: 23, ga: 11, gd: 12, pts: 23, status: 'Advanced' },
                { rank: 3, team: 'Arsenal', logo: '🔴', mp: 10, w: 6, d: 2, l: 2, gf: 19, ga: 10, gd: 9, pts: 20, status: 'Playoffs' },
                { rank: 4, team: 'Chelsea', logo: '🔵', mp: 10, w: 5, d: 3, l: 2, gf: 16, ga: 12, gd: 4, pts: 18, status: 'Eliminated' },
                { rank: 5, team: 'Tottenham', logo: '🔵', mp: 10, w: 4, d: 3, l: 3, gf: 14, ga: 13, gd: 1, pts: 15, status: 'Eliminated' },
                { rank: 6, team: 'Man United', logo: '🔴', mp: 10, w: 3, d: 4, l: 3, gf: 12, ga: 12, gd: 0, pts: 13, status: 'Eliminated' },
            ]
        },
        'La Liga': {
            type: 'club',
            groups: null,
            standings: [
                { rank: 1, team: 'Barcelona', logo: '🔵', mp: 10, w: 8, d: 1, l: 1, gf: 25, ga: 11, gd: 14, pts: 25, status: 'Advanced' },
                { rank: 2, team: 'Real Madrid', logo: '⚪', mp: 10, w: 7, d: 2, l: 1, gf: 23, ga: 11, gd: 12, pts: 23, status: 'Advanced' },
                { rank: 3, team: 'Sevilla', logo: '⚪', mp: 10, w: 6, d: 2, l: 2, gf: 19, ga: 10, gd: 9, pts: 20, status: 'Playoffs' },
                { rank: 4, team: 'Atletico Madrid', logo: '🔴', mp: 10, w: 5, d: 3, l: 2, gf: 16, ga: 12, gd: 4, pts: 18, status: 'Eliminated' },
            ]
        },
        'Bundesliga': {
            type: 'club',
            groups: null,
            standings: [
                { rank: 1, team: 'Bayern Munich', logo: '🔴', mp: 10, w: 8, d: 1, l: 1, gf: 25, ga: 11, gd: 14, pts: 25, status: 'Advanced' },
                { rank: 2, team: 'Dortmund', logo: '🟡', mp: 10, w: 7, d: 2, l: 1, gf: 23, ga: 11, gd: 12, pts: 23, status: 'Advanced' },
                { rank: 3, team: 'RB Leipzig', logo: '🔴', mp: 10, w: 6, d: 2, l: 2, gf: 19, ga: 10, gd: 9, pts: 20, status: 'Playoffs' },
                { rank: 4, team: 'Leverkusen', logo: '🔴', mp: 10, w: 5, d: 3, l: 2, gf: 16, ga: 12, gd: 4, pts: 18, status: 'Eliminated' },
            ]
        },
    };

    useEffect(() => {
        if (matchData && matchData.group) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserSelectedGroup(null);
            setActiveGroup(matchData.group);
        }
    }, [matchData]);

    const handleGroupClick = (group) => {
        setUserSelectedGroup(group);
        setActiveGroup(group);
    };

    const getLeagueToShow = () => {
        if (matchData && matchData.league) {
            return matchData.league;
        }
        return selectedLeague;
    };

    const getGroupToShow = () => {
        if (userSelectedGroup) {
            return userSelectedGroup;
        }
        if (matchData && matchData.group) {
            return matchData.group;
        }
        return activeGroup;
    };

    const getGroups = (league) => {
        if (league === 'All') return [];

        const data = allStandings[league];
        if (!data) return [];

        if (data.groups) {
            return Object.keys(data.groups);
        }
        return [];
    };

    const getStandingsData = (league) => {
        if (league === 'All') {
            return { standings: [] };
        }

        const data = allStandings[league];
        if (!data) return { standings: [] };

        if (data.groups) {
            const groupToShow = getGroupToShow();
            return { standings: data.groups[groupToShow] || [] };
        }

        return { standings: data.standings || [] };
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Advanced':
                return <span className="text-green-400 text-xs">Advanced</span>;
            case 'Playoffs':
                return <span className="text-yellow-400 text-xs">Playoffs</span>;
            case 'Eliminated':
                return <span className="text-red-400 text-xs">Eliminated</span>;
            default:
                return <span className="text-gray-400 text-xs">—</span>;
        }
    };

    const leagueToShow = getLeagueToShow();
    const groups = getGroups(leagueToShow);
    const groupToShow = getGroupToShow();
    const { standings } = getStandingsData(leagueToShow);

    if (leagueToShow === 'All' || !leagueToShow) {
        return (
            <div className="bg-[#1a1a1a] p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaCrown className="text-[#8b5cf6]" />
                        League Standings
                    </h2>
                </div>
                <div className="text-center text-gray-400 py-8">
                    <p>Select a league to view standings</p>
                </div>
            </div>
        );
    }

    if (standings.length === 0) {
        return (
            <div className="bg-[#1a1a1a] p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaCrown className="text-[#8b5cf6]" />
                        {leagueToShow} Standings
                    </h2>
                </div>
                <div className="text-center text-gray-400 py-8">
                    <p>No standings available for {leagueToShow}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FaCrown className="text-[#8b5cf6]" />
                    {leagueToShow} Standings
                </h2>

                {groups.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {groups.map((group) => (
                            <button
                                key={group}
                                onClick={() => handleGroupClick(group)}
                                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                                    groupToShow === group
                                        ? 'bg-[#8b5cf6] text-white'
                                        : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#8b5cf6]/20 hover:text-[#8b5cf6]'
                                }`}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                )}

                <Link to="/Standing">
                    <button className="text-sm text-[#8b5cf6] hover:underline flex items-center gap-1">
                        View Full Standings <FaArrowRight className="text-xs" />
                    </button>
                </Link>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#2a2a2a] text-gray-400">
                            <th className="text-left py-2 px-2 w-7.5">#</th>
                            <th className="text-left py-2 px-2">Team</th>
                            <th className="text-center py-2 px-2 w-8.75">MP</th>
                            <th className="text-center py-2 px-2 w-7.5">W</th>
                            <th className="text-center py-2 px-2 w-7.5">D</th>
                            <th className="text-center py-2 px-2 w-7.5">L</th>
                            <th className="text-center py-2 px-2 w-8.75">GF</th>
                            <th className="text-center py-2 px-2 w-8.75">GA</th>
                            <th className="text-center py-2 px-2 w-8.75">GD</th>
                            <th className="text-center py-2 px-2 w-8.75 font-bold text-[#8b5cf6]">Pts</th>
                            <th className="text-center py-2 px-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((team, index) => (
                            <tr key={index} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-all">
                                <td className="py-3 px-2 font-bold text-center text-white">{team.rank}</td>
                                <td className="py-3 px-2 flex items-center gap-2 text-white">
                                    <span className="text-xl">{team.logo}</span>
                                    <span className="font-semibold">{team.team}</span>
                                </td>
                                <td className="text-center py-3 px-2 text-gray-300">{team.mp}</td>
                                <td className="text-center py-3 px-2 text-gray-300">{team.w}</td>
                                <td className="text-center py-3 px-2 text-gray-300">{team.d}</td>
                                <td className="text-center py-3 px-2 text-gray-300">{team.l}</td>
                                <td className="text-center py-3 px-2 text-gray-300">{team.gf}</td>
                                <td className="text-center py-3 px-2 text-gray-300">{team.ga}</td>
                                <td className={`text-center py-3 px-2 font-bold ${team.gd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {team.gd >= 0 ? `+${team.gd}` : team.gd}
                                </td>
                                <td className="text-center py-3 px-2 font-bold text-[#8b5cf6]">{team.pts}</td>
                                <td className="text-center py-3 px-2">{getStatusBadge(team.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeagueStandings;