import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaExclamationCircle, FaSpinner, FaStar, FaThumbtack, FaTimes } from 'react-icons/fa';
import { selectTopMatch } from '../../api/admin/FeaturedFixtureApi';
import { getFixtureFeed } from '../../api/football/FootballApi';
import { getPinnedMatches, pinMatch, unpinMatch } from '../../api/football/PinnedMatchApi';
import { useAuth } from '../../hooks/useAuth';

const tabs = ['Live', 'Upcoming', 'Finished'];
const liveStatuses = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'];
const finishedStatuses = ['FT', 'AET', 'PEN'];

const getMatchId = (fixture) => {
    const matchId = fixture?.public_match_id || fixture?.api_fixture_id;
    return matchId ? String(matchId) : null;
};

const getFixtureStatus = (fixture) => {
    const status = String(fixture.status_short || 'NS').toUpperCase();

    if(liveStatuses.includes(status)){
        return 'live';
    }

    if(finishedStatuses.includes(status)){
        return 'finished';
    }

    return 'upcoming';
};

const getScoreText = (fixture) => {
    if(fixture.home_goals === null || fixture.home_goals === undefined || fixture.away_goals === null || fixture.away_goals === undefined){
        return fixture.match_time_local || 'TBD';
    }

    return `${fixture.home_goals} - ${fixture.away_goals}`;
};

const TeamLogo = ({ team }) => {
    if(team?.logo){
        return <img src={team.logo} alt="" className="h-7 w-7 rounded-full object-contain" />;
    }

    return (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-[10px] font-bold text-[#a78bfa]">
            {team?.code || team?.name?.slice(0, 2)?.toUpperCase() || 'FC'}
        </span>
    );
};

const getStatusBadge = (fixture) => {
    const status = getFixtureStatus(fixture);

    if(status === 'live'){
        return (
            <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400"></span>
                {fixture.elapsed ? `${fixture.elapsed}'` : 'Live'}
            </span>
        );
    }

    if(status === 'finished'){
        return (
            <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] font-semibold text-green-400">
                <FaCheckCircle className="text-[10px]" />
                Finished
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1 rounded-full bg-[#8b5cf6]/15 px-2 py-0.5 text-[11px] font-semibold text-[#a78bfa]">
            <FaClock className="text-[10px]" />
            Upcoming
        </span>
    );
};

const MatchFeedCard = ({
    fixture,
    isAdmin,
    isPinned,
    onSelectTopMatch,
    onTogglePin,
    pinLoading,
    topMatchLoading,
}) => {
    const matchId = getMatchId(fixture);
    const status = getFixtureStatus(fixture);

    return (
        <div className="group min-h-[178px] w-[82vw] max-w-[300px] shrink-0 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-3 transition-all hover:border-[#8b5cf6]/40 hover:bg-[#202020] sm:w-[320px] sm:max-w-none">
            <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-xs text-gray-400">{fixture.league?.name || 'Saved League'}</p>
                    <div className="mt-1">{getStatusBadge(fixture)}</div>
                </div>

                <div className="flex shrink-0 gap-1.5">
                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => onSelectTopMatch(matchId)}
                            disabled={topMatchLoading}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/15 text-amber-200 transition-all hover:bg-amber-400/25 disabled:cursor-wait disabled:opacity-70"
                            title="Select as top match"
                        >
                            {topMatchLoading ? <FaSpinner className="animate-spin text-xs" /> : <FaStar className="text-xs" />}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => onTogglePin(matchId)}
                        disabled={pinLoading}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all disabled:cursor-wait disabled:opacity-70 ${
                            isPinned
                                ? 'border-red-400/30 bg-red-500/15 text-red-200 hover:bg-red-500/25'
                                : 'border-[#2a2a2a] bg-black/40 text-gray-400 hover:border-[#8b5cf6]/40 hover:text-[#a78bfa]'
                        }`}
                        title={isPinned ? 'Remove pinned match' : 'Pin match'}
                    >
                        {pinLoading
                            ? <FaSpinner className="animate-spin text-xs" />
                            : isPinned
                                ? <FaTimes className="text-xs" />
                                : <FaThumbtack className="text-xs" />}
                    </button>
                </div>
            </div>

            <Link to={`/matches/${matchId}`} className="block">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="min-w-0">
                        <TeamLogo team={fixture.homeTeam} />
                        <p className="mt-1.5 truncate text-sm font-semibold text-white">{fixture.homeTeam?.name || 'Home Team'}</p>
                    </div>

                    <div className="rounded-lg bg-black/35 px-3 py-1.5 text-center">
                        <p className="text-base font-bold text-white">{getScoreText(fixture)}</p>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">{fixture.status_short || fixture.match_time_local || 'NS'}</p>
                    </div>

                    <div className="min-w-0 text-right">
                        <div className="flex justify-end">
                            <TeamLogo team={fixture.awayTeam} />
                        </div>
                        <p className="mt-1.5 truncate text-sm font-semibold text-white">{fixture.awayTeam?.name || 'Away Team'}</p>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#2a2a2a] pt-2 text-[11px] text-gray-400">
                    <span className="min-w-0 truncate">
                        {status === 'finished'
                            ? `Total goals: ${Number(fixture.home_goals || 0) + Number(fixture.away_goals || 0)}`
                            : `${fixture.match_date_local || ''} ${fixture.match_time_local || ''}`.trim() || 'Kickoff TBD'}
                    </span>
                    <span className="text-[#8b5cf6] opacity-0 transition-opacity group-hover:opacity-100">Details</span>
                </div>
            </Link>
        </div>
    );
};

const MatchList = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Live');
    const [fixtures, setFixtures] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pinnedIds, setPinnedIds] = useState(() => new Set());
    const [pinLoadingIds, setPinLoadingIds] = useState(() => new Set());
    const [topMatchLoadingIds, setTopMatchLoadingIds] = useState(() => new Set());
    const token = localStorage.getItem('token');
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const loadFixtures = async () => {
            setLoading(true);
            setError('');

            const result = await getFixtureFeed({ limit: 60 });

            if(result.ok){
                setFixtures(result.data?.fixtures || []);
                setMessage(result.data?.message || 'Fixture feed loaded successfully');
            }else{
                setFixtures([]);
                setMessage('');
                setError(result.data?.message || result.data?.error || 'Failed to load fixture feed');
            }

            setLoading(false);
        };

        loadFixtures();
    }, []);

    useEffect(() => {
        if(!token){
            return undefined;
        }

        const loadPinnedMatches = async () => {
            const result = await getPinnedMatches();

            if(result.ok){
                const nextPinnedIds = new Set(
                    (result.data?.pinnedMatches || [])
                        .map((pinnedMatch) => pinnedMatch.match?.public_match_id || pinnedMatch.match?.api_fixture_id)
                        .filter(Boolean)
                        .map((matchId) => String(matchId)),
                );
                setPinnedIds(nextPinnedIds);
            }
        };

        const handlePinnedMatchesUpdated = (event) => {
            const updatedMatchId = event.detail?.apiFixtureId ? String(event.detail.apiFixtureId) : null;

            if(updatedMatchId){
                setPinnedIds((current) => {
                    const next = new Set(current);

                    if(event.detail?.pinned){
                        next.add(updatedMatchId);
                    }else{
                        next.delete(updatedMatchId);
                    }

                    return next;
                });
                return;
            }

            loadPinnedMatches();
        };

        loadPinnedMatches();

        window.addEventListener('pinned-matches-updated', handlePinnedMatchesUpdated);

        return () => {
            window.removeEventListener('pinned-matches-updated', handlePinnedMatchesUpdated);
        };
    }, [token]);

    const handleTogglePin = async (apiFixtureId) => {
        if(!apiFixtureId){
            return;
        }

        if(!token){
            setMessage('Login to pin matches.');
            return;
        }

        const matchId = String(apiFixtureId);

        setPinLoadingIds((current) => {
            const next = new Set(current);
            next.add(matchId);
            return next;
        });

        const isPinned = pinnedIds.has(matchId);
        const result = isPinned
            ? await unpinMatch({ apiFixtureId })
            : await pinMatch({ apiFixtureId });

        if(result.ok){
            setPinnedIds((current) => {
                const next = new Set(current);

                if(isPinned){
                    next.delete(matchId);
                }else{
                    next.add(matchId);
                }

                return next;
            });
            setMessage(result.data?.message || (isPinned ? 'Match removed from pinned matches' : 'Match pinned successfully'));
            window.dispatchEvent(new CustomEvent('pinned-matches-updated', {
                detail: {
                    apiFixtureId: matchId,
                    pinned: !isPinned,
                },
            }));
        }else{
            setMessage(result.data?.message || result.data?.error || 'Could not update pinned match.');
        }

        setPinLoadingIds((current) => {
            const next = new Set(current);
            next.delete(matchId);
            return next;
        });
    };

    const handleSelectTopMatch = async (apiFixtureId) => {
        if(!apiFixtureId){
            return;
        }

        const matchId = String(apiFixtureId);

        setTopMatchLoadingIds((current) => {
            const next = new Set(current);
            next.add(matchId);
            return next;
        });

        const result = await selectTopMatch({
            apiFixtureId,
            label: 'Top Match',
        });

        if(result.ok){
            setMessage(result.data?.message || 'Top match selected successfully');
            window.dispatchEvent(new Event('top-match-updated'));
        }else{
            setMessage(result.data?.message || result.data?.error || 'Could not select top match.');
        }

        setTopMatchLoadingIds((current) => {
            const next = new Set(current);
            next.delete(matchId);
            return next;
        });
    };

    const filteredFixtures = useMemo(() => {
        return fixtures
            .filter((fixture) => getFixtureStatus(fixture) === activeTab.toLowerCase())
            .sort((a, b) => {
                const leftDate = new Date(a.match_datetime_local || a.match_date || 0);
                const rightDate = new Date(b.match_datetime_local || b.match_date || 0);
                const diff = leftDate - rightDate;

                return activeTab === 'Finished' ? -diff : diff;
            });
    }, [activeTab, fixtures]);

    const counts = useMemo(() => {
        return tabs.reduce((accumulator, tab) => {
            accumulator[tab] = fixtures.filter((fixture) => getFixtureStatus(fixture) === tab.toLowerCase()).length;
            return accumulator;
        }, {});
    }, [fixtures]);

    return (
        <section className="rounded-lg border border-[#2a2a2a] bg-[#101010] p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#8b5cf6]" />
                        <h2 className="text-lg font-semibold">Match Feed</h2>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                        {error || message || 'Live, upcoming, and finished matches from the database.'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                activeTab === tab
                                    ? 'bg-[#8b5cf6] text-white'
                                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#8b5cf6]/15 hover:text-[#a78bfa]'
                            }`}
                        >
                            {tab}
                            <span className="ml-1 rounded-full bg-black/25 px-1.5 py-0.5 text-[10px]">{counts[tab] || 0}</span>
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-[#2a2a2a] p-8 text-gray-400">
                    <FaSpinner className="animate-spin text-[#8b5cf6]" />
                    Loading saved matches...
                </div>
            ) : error ? (
                <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-[#2a2a2a] p-8 text-red-300">
                    <FaExclamationCircle />
                    {error}
                </div>
            ) : filteredFixtures.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#2a2a2a] p-8 text-center text-gray-400">
                    No {activeTab.toLowerCase()} matches saved in this feed yet.
                </div>
            ) : (
                <div className="overflow-x-auto pb-2">
                    <div className="flex gap-3">
                        {filteredFixtures.map((fixture) => (
                            <MatchFeedCard
                                key={getMatchId(fixture)}
                                fixture={fixture}
                                isAdmin={isAdmin}
                                isPinned={pinnedIds.has(getMatchId(fixture))}
                                pinLoading={pinLoadingIds.has(getMatchId(fixture))}
                                topMatchLoading={topMatchLoadingIds.has(getMatchId(fixture))}
                                onSelectTopMatch={handleSelectTopMatch}
                                onTogglePin={handleTogglePin}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default MatchList;
