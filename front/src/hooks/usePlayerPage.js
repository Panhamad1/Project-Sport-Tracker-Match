import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlayerProfile } from "../services/playerService";
import {
  buildCareerSummary,
  buildClubRows,
  getPrimaryStatistic,
  statisticSeasonFallbackOptions,
} from "../components/player/playerPageUtils";

export const usePlayerPage = () => {
  const { playerApiId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [player, setPlayer] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [statisticSeasons, setStatisticSeasons] = useState([]);
  const [selectedStatisticSeason, setSelectedStatisticSeason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPlayer = useCallback(async () => {
    setLoading(true);

    const result = await fetchPlayerProfile(playerApiId, { season: selectedStatisticSeason || undefined });

    if(result.ok){
      const nextStatisticSeasons = (result.data?.statistic_seasons || []).map(String);
      const nextSelectedSeason = result.data?.selected_statistic_season ? String(result.data.selected_statistic_season) : "";

      setPlayer(result.data?.player || null);
      setStatistics(result.data?.statistics || []);
      setStatisticSeasons(nextStatisticSeasons);
      if(!selectedStatisticSeason && nextSelectedSeason){
        setSelectedStatisticSeason(nextSelectedSeason);
      }
      setMessage(result.data?.message || "Player loaded successfully");
    }else{
      setPlayer(null);
      setStatistics([]);
      setStatisticSeasons([]);
      setMessage(result.data?.message || result.data?.error || "Failed to load player");
    }

    setLoading(false);
  }, [playerApiId, selectedStatisticSeason]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPlayer();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPlayer]);

  const primaryStatistic = useMemo(() => getPrimaryStatistic(statistics), [statistics]);
  const summary = useMemo(() => buildCareerSummary(statistics), [statistics]);
  const clubRows = useMemo(() => buildClubRows(statistics), [statistics]);
  const statisticSeasonOptions = useMemo(() => {
    const savedSeasons = statisticSeasons.length > 0 ? statisticSeasons : statisticSeasonFallbackOptions;

    return Array.from(new Set([selectedStatisticSeason, ...savedSeasons].filter(Boolean).map(String)));
  }, [selectedStatisticSeason, statisticSeasons]);
  const selectedDisplaySeason = selectedStatisticSeason || statisticSeasonOptions[0] || "2024";
  const facts = [
    player?.nationality ? { key: "nationality", type: "id", label: "Nationality", value: player.nationality } : null,
    player?.age ? { key: "age", type: "calendar", label: "Age", value: player.age } : null,
    player?.height ? { key: "height", type: "running", label: "Height", value: player.height } : null,
    player?.weight ? { key: "weight", type: "running", label: "Weight", value: player.weight } : null,
    primaryStatistic?.team?.name ? { key: "team", type: "shield", label: `Team ${primaryStatistic.season}`, value: primaryStatistic.team.name } : null,
    primaryStatistic?.league?.name ? { key: "league", type: "trophy", label: `League ${primaryStatistic.season}`, value: primaryStatistic.league.name } : null,
  ].filter(Boolean);
  const profileChips = [
    { key: "player", label: `Player ${player?.api_player_id}` },
    primaryStatistic?.team?.api_team_id ? { key: "team", label: `Team ${primaryStatistic.team.api_team_id}` } : null,
    primaryStatistic?.league?.api_league_id ? { key: "league", label: `League ${primaryStatistic.league.api_league_id}` } : null,
    primaryStatistic?.season ? { key: "season", label: `Season ${primaryStatistic.season}` } : null,
  ].filter(Boolean);

  return {
    activeTab,
    clubRows,
    facts,
    loading,
    message,
    player,
    primaryStatistic,
    profileChips,
    selectedDisplaySeason,
    setActiveTab,
    setSelectedStatisticSeason,
    statisticSeasonOptions,
    statistics,
    summary,
  };
};
