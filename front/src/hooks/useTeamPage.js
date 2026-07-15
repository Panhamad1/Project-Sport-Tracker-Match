import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import {
  addTeamToFavorites,
  fetchFavoriteTeams,
  fetchTeamProfile,
  removeTeamFromFavorites,
} from "../services/teamService";
import {
  buildMatchRecord,
  buildTeamForm,
  buildTeamLeaders,
  getFavoriteList,
  squadSeasonFallbackOptions,
} from "../components/team/teamPageUtils";

export const useTeamPage = () => {
  const { teamApiId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [team, setTeam] = useState(null);
  const [standings, setStandings] = useState([]);
  const [players, setPlayers] = useState([]);
  const [squadSeasons, setSquadSeasons] = useState([]);
  const [selectedSquadSeason, setSelectedSquadSeason] = useState("2024");
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  const handleBack = () => {
    if(window.history.length > 1){
      navigate(-1);
      return;
    }

    navigate("/leagues");
  };

  const currentStanding = standings[0];
  const profileChips = [
    { key: "team", label: `Team ${team?.api_team_id}` },
    currentStanding?.league?.api_league_id ? { key: "league", label: `League ${currentStanding.league.api_league_id}` } : null,
    currentStanding?.season ? { key: "season", label: `Season ${currentStanding.season}` } : null,
    team?.country ? { key: "country", label: team.country } : null,
    team?.founded ? { key: "founded", label: `Founded ${team.founded}` } : null,
  ].filter(Boolean);
  const teamFacts = [
    team?.venue_name ? { key: "venue", type: "location", label: "Venue", value: team.venue_name } : null,
    team?.venue_city ? { key: "city", type: "location", label: "City", value: team.venue_city } : null,
    team?.last_updated ? { key: "updated", type: "calendar", label: "Last Updated", value: new Date(team.last_updated).toLocaleString() } : null,
    currentStanding?.league?.name ? { key: "league", type: "trophy", label: `League ${currentStanding.season}`, value: currentStanding.league.name } : null,
  ].filter(Boolean);

  const totalGoals = useMemo(() => {
    return players.reduce((total, player) => total + Number(player.goals || 0), 0);
  }, [players]);

  const squadSeasonOptions = useMemo(() => {
    const savedSeasons = squadSeasons.length > 0 ? squadSeasons : squadSeasonFallbackOptions;

    return Array.from(new Set([selectedSquadSeason, ...savedSeasons].filter(Boolean).map(String)));
  }, [selectedSquadSeason, squadSeasons]);

  const teamFormEntries = useMemo(() => {
    return buildTeamForm(recentMatches, team?.api_team_id);
  }, [recentMatches, team]);

  const formRecord = useMemo(() => {
    return buildMatchRecord(teamFormEntries);
  }, [teamFormEntries]);

  const teamLeaders = useMemo(() => {
    return buildTeamLeaders(players);
  }, [players]);

  const loadTeam = useCallback(async () => {
    setLoading(true);

    const result = await fetchTeamProfile(teamApiId, { season: selectedSquadSeason });

    if(result.ok){
      const nextSquadSeasons = (result.data?.player_seasons || []).map(String);

      setTeam(result.data?.team || null);
      setStandings(result.data?.standings || []);
      setPlayers(result.data?.players || []);
      setSquadSeasons(nextSquadSeasons);
      setRecentMatches(result.data?.recent_matches || []);
      setUpcomingMatches(result.data?.upcoming_matches || []);
      setMessage(result.data?.message || "Team loaded successfully");
    }else{
      setTeam(null);
      setStandings([]);
      setPlayers([]);
      setSquadSeasons([]);
      setRecentMatches([]);
      setUpcomingMatches([]);
      setMessage(result.data?.message || result.data?.error || "Failed to load team");
    }

    setLoading(false);
  }, [selectedSquadSeason, teamApiId]);

  const loadFavoriteStatus = useCallback(async () => {
    if(!user || !team?.id){
      setIsFavorite(false);
      return;
    }

    const result = await fetchFavoriteTeams();

    if(result.ok){
      const favorites = getFavoriteList(result.data);
      setIsFavorite(favorites.some((item) => item.team_id === team.id || item.team?.id === team.id));
    }
  }, [team, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTeam();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadTeam]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadFavoriteStatus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadFavoriteStatus]);

  const handleFavoriteToggle = async () => {
    if(!team?.id || !user){
      return;
    }

    setFavoriteLoading(true);
    setFavoriteMessage("");

    const result = isFavorite
      ? await removeTeamFromFavorites(team.id)
      : await addTeamToFavorites(team.id);

    if(result.ok){
      setIsFavorite(!isFavorite);
      setFavoriteMessage(result.data?.message || (isFavorite ? "Removed from favorites" : "Added to favorites"));
    }else{
      setFavoriteMessage(result.data?.message || result.data?.error || "Failed to update favorite team");
    }

    setFavoriteLoading(false);
  };

  return {
    activeTab,
    authLoading,
    currentStanding,
    favoriteLoading,
    favoriteMessage,
    formRecord,
    handleBack,
    handleFavoriteToggle,
    isFavorite,
    loading,
    message,
    players,
    profileChips,
    recentMatches,
    selectedSquadSeason,
    setActiveTab,
    setSelectedSquadSeason,
    squadSeasonOptions,
    standings,
    team,
    teamFacts,
    teamFormEntries,
    teamLeaders,
    totalGoals,
    upcomingMatches,
    user,
  };
};
