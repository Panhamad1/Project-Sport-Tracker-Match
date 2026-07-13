import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaLock, FaSpinner, FaThumbtack, FaTimes } from "react-icons/fa";
import { getPinnedMatches, unpinMatch } from "../../api/football/PinnedMatchApi";

const getScoreText = (match) => {
    if(match?.home_goals === null || match?.home_goals === undefined || match?.away_goals === null || match?.away_goals === undefined){
        return match?.match_time_local || "TBD";
    }

    return `${match.home_goals} - ${match.away_goals}`;
};

const TeamLogo = ({ team }) => {
    if(team?.logo){
        return <img src={team.logo} alt="" className="h-7 w-7 rounded-full object-contain" />;
    }

    return (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-[10px] font-bold text-[#a78bfa]">
            {team?.code || team?.name?.slice(0, 2)?.toUpperCase() || "FC"}
        </span>
    );
};

const getPinnedMatchId = (pinnedMatch) => {
    const matchId = pinnedMatch?.match?.public_match_id || pinnedMatch?.match?.api_fixture_id;
    return matchId ? String(matchId) : null;
};

const PinnedMatchItem = ({ onRemove, pinnedMatch, removeLoading }) => {
    const match = pinnedMatch.match;
    const matchId = getPinnedMatchId(pinnedMatch);

    if(!match || !matchId){
        return null;
    }

    return (
        <div className="relative rounded-lg border border-[#2a2a2a] bg-[#111111] transition-all hover:border-[#8b5cf6]/40 hover:bg-[#1a1a1a]">
            <button
                type="button"
                onClick={() => onRemove(matchId)}
                disabled={removeLoading}
                className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-red-400/30 bg-red-500/15 text-red-200 transition-all hover:bg-red-500/25 disabled:cursor-wait disabled:opacity-70"
                title="Remove pinned match"
            >
                {removeLoading ? <FaSpinner className="animate-spin text-xs" /> : <FaTimes className="text-xs" />}
            </button>

            <Link to={`/matches/${matchId}`} className="block p-3 pr-12">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-gray-500">{match.league?.name || "Saved League"}</span>
                    <span className="rounded-full bg-[#8b5cf6]/15 px-2 py-0.5 text-[10px] font-semibold text-[#a78bfa]">
                        {match.status_short || "NS"}
                    </span>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                        <TeamLogo team={match.homeTeam} />
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{match.homeTeam?.name || "Home Team"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TeamLogo team={match.awayTeam} />
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{match.awayTeam?.name || "Away Team"}</span>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#2a2a2a] pt-2 text-xs text-gray-400">
                    <span className="font-bold text-white">{getScoreText(match)}</span>
                    <span className="inline-flex items-center gap-1">
                        <FaClock className="text-[10px]" />
                        {match.match_date_local || "Date TBD"}
                    </span>
                </div>
            </Link>
        </div>
    );
};

const PinnedMatchesCard = () => {
    const [pinnedMatches, setPinnedMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [removingIds, setRemovingIds] = useState(() => new Set());
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token){
            return undefined;
        }

        const loadPinnedMatches = async () => {
            setLoading(true);
            setError("");

            const result = await getPinnedMatches();

            if(result.ok){
                setPinnedMatches(result.data?.pinnedMatches || []);
            }else{
                setPinnedMatches([]);
                setError(result.data?.message || result.data?.error || "Failed to load pinned matches");
            }

            setLoading(false);
        };

        loadPinnedMatches();
        window.addEventListener("pinned-matches-updated", loadPinnedMatches);

        return () => {
            window.removeEventListener("pinned-matches-updated", loadPinnedMatches);
        };
    }, [token]);

    const handleRemovePinnedMatch = async (apiFixtureId) => {
        if(!apiFixtureId){
            return;
        }

        setRemovingIds((current) => {
            const next = new Set(current);
            next.add(apiFixtureId);
            return next;
        });

        const result = await unpinMatch({ apiFixtureId });

        if(result.ok){
            const matchId = String(apiFixtureId);

            setPinnedMatches((current) => current.filter((pinnedMatch) => {
                return getPinnedMatchId(pinnedMatch) !== matchId;
            }));
            window.dispatchEvent(new CustomEvent("pinned-matches-updated", {
                detail: {
                    apiFixtureId: matchId,
                    pinned: false,
                },
            }));
        }else{
            setError(result.data?.message || result.data?.error || "Failed to remove pinned match");
        }

        setRemovingIds((current) => {
            const next = new Set(current);
            next.delete(apiFixtureId);
            return next;
        });
    };

    return (
        <section className="rounded-lg border border-[#2a2a2a] bg-[#101010] p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <FaThumbtack className="text-[#8b5cf6]" />
                    <h2 className="font-semibold">Pinned Matches</h2>
                </div>
                {pinnedMatches.length > 0 && (
                    <span className="rounded-full bg-[#8b5cf6]/15 px-2 py-0.5 text-xs font-semibold text-[#a78bfa]">
                        {pinnedMatches.length}
                    </span>
                )}
            </div>

            {!token ? (
                <div className="mt-4 rounded-lg border border-dashed border-[#2a2a2a] p-4 text-sm text-gray-400">
                    <FaLock className="mb-2 text-[#8b5cf6]" />
                    Login to keep important matches close.
                </div>
            ) : loading ? (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-[#2a2a2a] p-4 text-sm text-gray-400">
                    <FaSpinner className="animate-spin text-[#8b5cf6]" />
                    Loading pinned matches...
                </div>
            ) : error ? (
                <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                </p>
            ) : pinnedMatches.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-[#2a2a2a] p-4 text-sm text-gray-400">
                    Pin matches you care about and they will appear here.
                </p>
            ) : (
                <div className="mt-4 space-y-3">
                    {pinnedMatches.slice(0, 3).map((pinnedMatch) => (
                        <PinnedMatchItem
                            key={getPinnedMatchId(pinnedMatch) || pinnedMatch.pinned_at}
                            onRemove={handleRemovePinnedMatch}
                            pinnedMatch={pinnedMatch}
                            removeLoading={removingIds.has(getPinnedMatchId(pinnedMatch))}
                        />
                    ))}
                    {pinnedMatches.length > 3 && (
                        <Link to="/profile/pinned" className="block text-center text-sm font-medium text-[#a78bfa] hover:text-white">
                            View all pinned matches
                        </Link>
                    )}
                </div>
            )}
        </section>
    );
};

export default PinnedMatchesCard;
