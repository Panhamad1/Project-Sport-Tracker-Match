import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaCrown,
  FaMedal,
  FaSpinner,
  FaSyncAlt,
  FaTrophy,
  FaUserCircle,
} from "react-icons/fa";
import { getLeaderboard } from "../api/leaderboard/LeaderboardApi";
import PanelCard from "../components/common/PanelCard";
import NoDataState from "../components/matches/NoDataState";
import { useAuth } from "../hooks/useAuth";

const limitOptions = [10, 25, 50, 100];

const formatPoints = (points) => {
  const value = Number(points || 0);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value) => {
  const numberValue = Number(value || 0);

  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(numberValue) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numberValue)}%`;
};

const podiumStyles = {
  1: {
    icon: <FaCrown />,
    badge: "Champion",
    className: "border-[#facc15]/40 bg-[#facc15]/10",
    iconClassName: "text-[#facc15]",
  },
  2: {
    icon: <FaMedal />,
    badge: "Second",
    className: "border-slate-300/30 bg-slate-300/10",
    iconClassName: "text-slate-200",
  },
  3: {
    icon: <FaMedal />,
    badge: "Third",
    className: "border-[#c084fc]/40 bg-[#8b5cf6]/10",
    iconClassName: "text-[#c084fc]",
  },
};

const PodiumCard = ({ entry }) => {
  const style = podiumStyles[entry.rank] || podiumStyles[3];

  return (
    <div className={`rounded-lg border p-5 ${style.className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-gray-400">{style.badge}</p>
          <h3 className="mt-2 truncate text-lg font-semibold text-white">{entry.username}</h3>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/30 text-xl ${style.iconClassName}`}>
          {style.icon}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <span className="text-sm text-gray-400">Rank #{entry.rank}</span>
        <span className="text-2xl font-bold text-white">{formatPoints(entry.points)}</span>
      </div>
      <p className="mt-1 text-right text-xs text-gray-500">points</p>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-xs">
        <div>
          <p className="text-gray-500">Predictions</p>
          <p className="mt-1 font-semibold text-white">{entry.prediction_count || 0}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Win Rate</p>
          <p className="mt-1 font-semibold text-white">{formatPercent(entry.win_rate)}</p>
        </div>
      </div>
    </div>
  );
};

const LeaderboardRow = ({ entry, isCurrentUser }) => {
  return (
    <tr className={`border-t border-[#2a2a2a] ${isCurrentUser ? "bg-[#8b5cf6]/10" : ""}`}>
      <td className="px-4 py-4">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
          entry.rank <= 3 ? "bg-[#8b5cf6]/20 text-[#c4b5fd]" : "bg-[#1a1a1a] text-gray-300"
        }`}>
          {entry.rank}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <FaUserCircle className="shrink-0 text-2xl text-[#8b5cf6]" />
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{entry.username}</p>
            {isCurrentUser && <p className="text-xs text-[#a78bfa]">Your account</p>}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right text-gray-200">
        {entry.prediction_count || 0}
      </td>
      <td className="px-4 py-4 text-right">
        <span className="inline-flex rounded-full bg-[#8b5cf6]/15 px-2.5 py-1 text-xs font-semibold text-[#c4b5fd]">
          {formatPercent(entry.win_rate)}
        </span>
      </td>
      <td className="px-4 py-4 text-right font-semibold text-white">
        {formatPoints(entry.points)}
      </td>
    </tr>
  );
};

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [limit, setLimit] = useState(50);
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLeaderboard = useCallback(async (selectedLimit = limit) => {
    setLoading(true);
    setError("");

    const result = await getLeaderboard({ limit: selectedLimit });

    if(result.ok){
      setLeaderboard(result.data?.leaderboard || []);
      setMessage(result.data?.message || "Leaderboard loaded successfully");
    }else{
      setLeaderboard([]);
      setMessage("");
      setError(result.data?.message || result.data?.error || "Failed to load leaderboard");
    }

    setLoading(false);
  }, [limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLeaderboard(limit);
    }, 0);

    return () => clearTimeout(timer);
  }, [limit, loadLeaderboard]);

  const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const leader = leaderboard[0];
  const totalPredictionCount = useMemo(() => {
    return leaderboard.reduce((total, entry) => total + Number(entry.prediction_count || 0), 0);
  }, [leaderboard]);

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-[#8b5cf6]">Leaderboard</p>
          <h1 className="mt-1 text-2xl font-bold">Prediction Rankings</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Track prediction points from completed matches. Correct picks add points, and missed picks reduce points based on the saved odds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {limitOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLimit(option)}
              className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                limit === option
                  ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                  : "border-[#2a2a2a] bg-[#0d0d0d] text-gray-400 hover:text-white"
              }`}
            >
              Top {option}
            </button>
          ))}

          <button
            type="button"
            onClick={() => loadLeaderboard(limit)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PanelCard className="p-5">
          <p className="text-sm text-gray-400">Ranked Players</p>
          <p className="mt-3 text-3xl font-bold">{leaderboard.length}</p>
        </PanelCard>
        <PanelCard className="p-5">
          <p className="text-sm text-gray-400">Current Leader</p>
          <p className="mt-3 truncate text-2xl font-bold">{leader?.username || "No leader yet"}</p>
        </PanelCard>
        <PanelCard className="p-5">
          <p className="text-sm text-gray-400">Total Predictions</p>
          <p className="mt-3 text-3xl font-bold">{totalPredictionCount}</p>
        </PanelCard>
        <PanelCard className="p-5">
          <p className="text-sm text-gray-400">Leading Points</p>
          <p className="mt-3 text-3xl font-bold">{leader ? formatPoints(leader.points) : "0"}</p>
        </PanelCard>
      </div>

      {topThree.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {topThree.map((entry) => (
            <PodiumCard key={`${entry.rank}-${entry.username}`} entry={entry} />
          ))}
        </div>
      )}

      <PanelCard className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] p-5">
          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <FaTrophy className="text-[#8b5cf6]" />
              Full Table
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {error || message || "Prediction points are loaded from saved match results."}
            </p>
          </div>
          <span className="rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-xs text-[#a78bfa]">
            Top {limit}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
            <FaSpinner className="animate-spin text-[#8b5cf6]" />
            Loading rankings...
          </div>
        ) : error ? (
          <div className="p-5">
            <NoDataState
              title="Leaderboard Unavailable"
              message={error}
            />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-5">
            <NoDataState
              title="No Rankings Yet"
              message="Prediction points will appear here after finished matches are awarded."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#111111] text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Player</th>
                  <th className="px-4 py-3 text-right font-medium">Predictions</th>
                  <th className="px-4 py-3 text-right font-medium">Win Rate</th>
                  <th className="px-4 py-3 text-right font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <LeaderboardRow
                    key={`${entry.rank}-${entry.username}`}
                    entry={entry}
                    isCurrentUser={Boolean(user?.username && user.username === entry.username)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>
    </div>
  );
};

export default LeaderboardPage;
