import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaClock, FaExclamationCircle, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { getTopMatch } from '../../api/football/FootballApi';

const liveStatuses = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'];
const finishedStatuses = ['FT', 'AET', 'PEN'];

const getScoreText = (match) => {
    if(match?.home_goals === null || match?.home_goals === undefined || match?.away_goals === null || match?.away_goals === undefined){
        return match?.match_time_local || 'TBD';
    }

    return `${match.home_goals} - ${match.away_goals}`;
};

const getStatusInfo = (match) => {
    const status = match?.status_short || 'NS';
    const isLive = liveStatuses.includes(status);
    const isFinished = finishedStatuses.includes(status);

    return {
        label: isLive && match?.elapsed ? `${match.elapsed}'` : status,
        className: isLive
            ? 'bg-red-500/15 text-red-300'
            : isFinished
                ? 'bg-green-500/15 text-green-300'
                : 'bg-[#8b5cf6]/15 text-[#a78bfa]',
        pulse: isLive,
    };
};

const TeamMark = ({ team }) => {
    if(team?.logo){
        return <img src={team.logo} alt="" className="h-16 w-16 rounded-full object-contain sm:h-20 sm:w-20" />;
    }

    return (
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/30 text-sm font-bold text-[#a78bfa] sm:h-20 sm:w-20">
            {team?.code || team?.name?.slice(0, 3)?.toUpperCase() || 'TBD'}
        </span>
    );
};

const EmptyTopMatch = ({ title, message, icon }) => {
    return (
        <section className="rounded-lg border border-dashed border-[#2a2a2a] bg-[#101010] p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#8b5cf6]/15 text-[#a78bfa]">
                {icon}
            </div>
            <h2 className="mt-3 font-semibold text-white">{title}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">{message}</p>
        </section>
    );
};

const TopMatchCard = () => {
    const [topMatch, setTopMatch] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadTopMatch = async () => {
            setLoading(true);
            setError('');

            const result = await getTopMatch();

            if(result.ok){
                setTopMatch(result.data?.topMatch || null);
                setMessage(result.data?.message || '');
            }else{
                setTopMatch(null);
                setError(result.data?.message || result.data?.error || 'Failed to load top match');
            }

            setLoading(false);
        };

        loadTopMatch();
        window.addEventListener('top-match-updated', loadTopMatch);

        return () => {
            window.removeEventListener('top-match-updated', loadTopMatch);
        };
    }, []);

    if(loading){
        return (
            <EmptyTopMatch
                title="Loading Top Match"
                message="Checking the selected match from the database."
                icon={<FaSpinner className="animate-spin" />}
            />
        );
    }

    if(error){
        return (
            <EmptyTopMatch
                title="Top Match Unavailable"
                message={error}
                icon={<FaExclamationCircle />}
            />
        );
    }

    const match = topMatch?.match;

    if(!match){
        return (
            <EmptyTopMatch
                title="No Top Match Selected"
                message={message || 'Admin can select one saved match to feature here.'}
                icon={<FaBolt />}
            />
        );
    }

    const matchId = match.public_match_id || match.api_fixture_id;
    if(!matchId){
        return (
            <EmptyTopMatch
                title="Top Match Unavailable"
                message="The selected match is missing its public match id."
                icon={<FaExclamationCircle />}
            />
        );
    }

    const status = getStatusInfo(match);

    return (
        <Link to={`/matches/${matchId}`} className="group block overflow-hidden rounded-lg border border-[#8b5cf6]/25 bg-[#101010] transition-all hover:border-[#8b5cf6]/50">
            <section>
                <div className="border-b border-[#2a2a2a] px-5 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs font-semibold text-[#a78bfa]">
                                <FaBolt />
                                {topMatch.label || 'Top Match'}
                            </span>
                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                                {status.pulse && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-300"></span>}
                                {status.label}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {match.league?.name || 'Saved League'} - {match.match_date_local || 'Date TBD'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-center gap-5 px-4 py-5 text-center sm:grid-cols-[1fr_auto_1fr] sm:px-5 sm:py-6 sm:text-left">
                    <div className="min-w-0">
                        <div className="flex justify-center sm:block">
                            <TeamMark team={match.homeTeam} />
                        </div>
                        <h2 className="mt-3 truncate text-lg font-bold sm:text-xl md:text-2xl">{match.homeTeam?.name || 'Home Team'}</h2>
                        <p className="mt-1 text-xs text-gray-500">Home</p>
                    </div>

                    <div className="mx-auto min-w-[112px] rounded-lg bg-black/40 px-5 py-3 text-center">
                        <p className="text-2xl font-black leading-none text-white sm:text-3xl">
                            {getScoreText(match)}
                        </p>
                        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                            <FaClock className="text-[10px]" />
                            {match.match_time_local || status.label}
                        </p>
                    </div>

                    <div className="min-w-0 text-center sm:text-right">
                        <div className="flex justify-center sm:justify-end">
                            <TeamMark team={match.awayTeam} />
                        </div>
                        <h2 className="mt-3 truncate text-lg font-bold sm:text-xl md:text-2xl">{match.awayTeam?.name || 'Away Team'}</h2>
                        <p className="mt-1 text-xs text-gray-500">Away</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2a2a2a] px-5 py-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#8b5cf6]" />
                        {match.venue_name || 'Venue TBD'}
                    </span>
                    <span className="text-[#a78bfa] opacity-0 transition-opacity group-hover:opacity-100">
                        Open match
                    </span>
                </div>
            </section>
        </Link>
    );
};

export default TopMatchCard;
