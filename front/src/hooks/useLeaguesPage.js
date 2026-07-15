import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchLeagueStandings } from "../services/leagueService";
import { featuredLeagues, getDefaultLeague } from "../components/leagues/leagueConfig";
import { getTeamDisplay, groupStandings, normalizeStanding } from "../components/leagues/leagueHelpers";

export const useLeaguesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultLeague = getDefaultLeague();
  const selectedLeagueId = Number(searchParams.get("league")) || defaultLeague.apiLeagueId;
  const selectedLeagueConfig = featuredLeagues.find((league) => league.apiLeagueId === selectedLeagueId) || defaultLeague;
  const selectedSeason = searchParams.get("season") || selectedLeagueConfig.season;
  const [league, setLeague] = useState(null);
  const [standings, setStandings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedLeague = useMemo(() => {
    return league || selectedLeagueConfig;
  }, [league, selectedLeagueConfig]);

  const normalizedStandings = useMemo(() => {
    return standings.map(normalizeStanding);
  }, [standings]);

  const groupedStandings = useMemo(() => {
    return groupStandings(normalizedStandings);
  }, [normalizedStandings]);

  const leader = normalizedStandings[0];

  const totalGoals = useMemo(() => {
    return normalizedStandings.reduce((total, standing) => {
      return total + Number(standing.goals_for || 0);
    }, 0);
  }, [normalizedStandings]);

  const totalPlayed = useMemo(() => {
    return normalizedStandings.reduce((total, standing) => {
      return total + Number(standing.played || 0);
    }, 0);
  }, [normalizedStandings]);

  const leaderName = leader ? getTeamDisplay(leader) : "No leader yet";

  const handleSelectLeague = (nextLeague) => {
    setSearchParams({
      league: String(nextLeague.apiLeagueId),
      season: String(nextLeague.season),
    });
  };

  const handleSeasonChange = (event) => {
    setSearchParams({
      league: String(selectedLeagueConfig.apiLeagueId),
      season: event.target.value,
    });
  };

  const loadStandings = useCallback(async () => {
    setLoading(true);
    setError("");

    const result = await fetchLeagueStandings({
      league: selectedLeagueConfig.apiLeagueId,
      season: selectedSeason,
    });

    if(result.ok){
      setLeague(result.data?.league || null);
      setStandings(result.data?.standings || []);
      setMessage(result.data?.message || "League standings loaded successfully");
    }else{
      setLeague(null);
      setStandings([]);
      setMessage("");
      setError(result.data?.message || result.data?.error || "No standings synced for this league yet.");
    }

    setLoading(false);
  }, [selectedLeagueConfig.apiLeagueId, selectedSeason]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStandings();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadStandings]);

  return {
    error,
    featuredLeagues,
    groupedStandings,
    handleSeasonChange,
    handleSelectLeague,
    leaderName,
    loadStandings,
    loading,
    message,
    normalizedStandings,
    selectedLeague,
    selectedLeagueConfig,
    selectedSeason,
    totalGoals,
    totalPlayed,
  };
};
