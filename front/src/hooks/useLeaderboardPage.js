import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLeaderboard } from "../services/leaderboardService";

export const limitOptions = [10, 25, 50, 100];

export const useLeaderboardPage = () => {
  const [limit, setLimit] = useState(50);
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLeaderboard = useCallback(async (selectedLimit = limit) => {
    setLoading(true);
    setError("");

    const result = await fetchLeaderboard({ limit: selectedLimit });

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

  return {
    error,
    leaderboard,
    leader,
    limit,
    loading,
    loadLeaderboard,
    message,
    setLimit,
    topThree,
    totalPredictionCount,
  };
};
