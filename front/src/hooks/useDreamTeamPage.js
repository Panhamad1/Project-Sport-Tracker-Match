import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import {
  createDreamTeam,
  editDreamTeam,
  fetchDreamTeamFormations,
  fetchMyDreamTeams,
  removeDreamTeam,
  searchDreamTeamPlayers,
} from "../services/dreamTeamService";
import {
  buildPlayersPayload,
  defaultFormation,
  defaultMaxDreamTeams,
  emptySlotValue,
  getDuplicatePlayer,
  getPlayerDisplayName,
  normalizePlayersBySlot,
} from "../components/dreamTeam/dreamTeamUtils";

export const useDreamTeamPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [formations, setFormations] = useState([]);
  const [dreamTeams, setDreamTeams] = useState([]);
  const [maxDreamTeams, setMaxDreamTeams] = useState(defaultMaxDreamTeams);
  const [dreamTeamId, setDreamTeamId] = useState(null);
  const [teamName, setTeamName] = useState("My Dream Team");
  const [formation, setFormation] = useState(defaultFormation);
  const [playersBySlot, setPlayersBySlot] = useState({});
  const [activeSlot, setActiveSlot] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerResults, setPlayerResults] = useState([]);
  const [playerSearchLoading, setPlayerSearchLoading] = useState(false);
  const [playerSearchMessage, setPlayerSearchMessage] = useState("");
  const [playerRoleFilter, setPlayerRoleFilter] = useState("ALL");

  const activeFormation = useMemo(() => {
    return formations.find((item) => item.formation === formation) || formations[0] || {
      formation: defaultFormation,
      slots: [],
    };
  }, [formation, formations]);

  const applyDreamTeam = useCallback((dreamTeam) => {
    if(dreamTeam){
      setDreamTeamId(dreamTeam.dream_team_id);
      setTeamName(dreamTeam.name || "My Dream Team");
      setFormation(dreamTeam.formation || defaultFormation);
      setPlayersBySlot(normalizePlayersBySlot(dreamTeam.players || []));
    }else{
      setDreamTeamId(null);
      setTeamName("Dream Team 1");
      setFormation(defaultFormation);
      setPlayersBySlot({});
    }

    setActiveSlot(null);
    setPlayerSearch("");
    setPlayerResults([]);
    setPlayerSearchMessage("");
    setPlayerRoleFilter("ALL");
  }, []);

  const loadDreamTeam = useCallback(async () => {
    if(!user){
      return;
    }

    setLoading(true);
    setError("");

    const [formationResult, dreamTeamResult] = await Promise.all([
      fetchDreamTeamFormations(),
      fetchMyDreamTeams(),
    ]);

    if(formationResult.ok){
      const nextFormations = formationResult.data?.formations || [];
      setFormations(nextFormations);
    }else{
      setFormations([]);
      setError(formationResult.data?.message || formationResult.data?.error || "Failed to load formations");
    }

    if(dreamTeamResult.ok){
      const nextDreamTeams = dreamTeamResult.data?.dreamTeams || (
        dreamTeamResult.data?.dreamTeam ? [dreamTeamResult.data.dreamTeam] : []
      );
      const nextMaxDreamTeams = dreamTeamResult.data?.maxDreamTeams || defaultMaxDreamTeams;

      setDreamTeams(nextDreamTeams);
      setMaxDreamTeams(nextMaxDreamTeams);
      applyDreamTeam(nextDreamTeams[0] || null);

      setMessage(dreamTeamResult.data?.message || "Dream team loaded successfully");
    }else{
      setDreamTeamId(null);
      setDreamTeams([]);
      setPlayersBySlot({});
      setError(dreamTeamResult.data?.message || dreamTeamResult.data?.error || "Failed to load dream team");
    }

    setLoading(false);
  }, [applyDreamTeam, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadDreamTeam();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadDreamTeam]);

  useEffect(() => {
    const keyword = playerSearch.trim();

    if(!activeSlot || keyword.length < 2){
      return undefined;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setPlayerSearchLoading(true);
      setPlayerSearchMessage("");

      const result = await searchDreamTeamPlayers({
        search: keyword,
        position: playerRoleFilter,
      });

      if(cancelled){
        return;
      }

      if(result.ok){
        const players = result.data?.players || [];
        setPlayerResults(players);
        setPlayerSearchMessage(players.length === 0 ? "No saved players found for this search." : "");
      }else{
        setPlayerResults([]);
        setPlayerSearchMessage(result.data?.message || result.data?.error || "Failed to search players.");
      }

      setPlayerSearchLoading(false);
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeSlot, playerRoleFilter, playerSearch]);

  const handleFormationChange = (nextFormation) => {
    setFormation(nextFormation);
    setPlayersBySlot({});
    setActiveSlot(null);
    setPlayerSearch("");
    setPlayerResults([]);
    setPlayerSearchMessage("");
    setPlayerRoleFilter("ALL");
  };

  const handleSelectSlot = (slot) => {
    const currentPlayer = playersBySlot[slot.slot];

    setActiveSlot(slot);
    setPlayerSearch(currentPlayer?.name || "");
    setPlayerResults([]);
    setPlayerSearchMessage("");
    setPlayerRoleFilter(slot.position || "ALL");
  };

  const closeSlotEditor = () => {
    setActiveSlot(null);
    setPlayerSearch("");
    setPlayerResults([]);
    setPlayerSearchMessage("");
    setPlayerSearchLoading(false);
    setPlayerRoleFilter("ALL");
  };

  const handlePlayerSearchChange = (value) => {
    const keyword = value.trim();

    setPlayerSearch(value);

    if(keyword.length < 2){
      setPlayerResults([]);
      setPlayerSearchMessage(keyword ? "Type at least 2 letters to search saved players." : "");
      setPlayerSearchLoading(false);
    }
  };

  const handleRoleFilterChange = (value) => {
    setPlayerRoleFilter(value);
    setPlayerResults([]);
    setPlayerSearchMessage("");
  };

  const isPlayerUsedInOtherSlot = (playerApiId, currentSlot) => {
    return Object.entries(playersBySlot).some(([slot, player]) => {
      return slot !== currentSlot && Number(player.api_player_id) === Number(playerApiId);
    });
  };

  const selectPlayerForSlot = (slot, player) => {
    const displayName = getPlayerDisplayName(player);

    if(isPlayerUsedInOtherSlot(player.api_player_id, slot)){
      setPlayerSearchMessage(`${displayName} is already selected in another position.`);
      return;
    }

    setPlayersBySlot((current) => ({
      ...current,
      [slot]: {
        api_player_id: player.api_player_id || "",
        name: displayName,
        photo: player.photo || "",
        nationality: player.nationality || "",
      },
    }));
    setPlayerSearch(displayName);
    setPlayerResults([]);
    setPlayerSearchMessage("");
  };

  const clearSlot = (slot) => {
    setPlayersBySlot((current) => {
      const nextPlayers = { ...current };
      delete nextPlayers[slot];
      return nextPlayers;
    });

    if(activeSlot?.slot === slot){
      setPlayerSearch("");
      setPlayerResults([]);
      setPlayerSearchMessage("");
    }
  };

  const handleSelectDreamTeam = (dreamTeam) => {
    applyDreamTeam(dreamTeam);
    setError("");
    setMessage(`${dreamTeam.name || "Dream team"} selected`);
  };

  const handleCreateNewTeam = () => {
    if(dreamTeams.length >= maxDreamTeams){
      setError(`You can save up to ${maxDreamTeams} dream teams.`);
      setMessage("");
      return;
    }

    const nextNumber = dreamTeams.length + 1;
    setDreamTeamId(null);
    setTeamName(`Dream Team ${nextNumber}`);
    setFormation(defaultFormation);
    setPlayersBySlot({});
    setActiveSlot(null);
    setPlayerSearch("");
    setPlayerResults([]);
    setPlayerSearchMessage("");
    setPlayerSearchLoading(false);
    setPlayerRoleFilter("ALL");
    setError("");
    setMessage("Build your new dream team, then save it.");
  };

  const filledSlots = Object.values(playersBySlot).filter((player) => player.api_player_id || player.name).length;
  const selectedSlotPlayer = activeSlot ? playersBySlot[activeSlot.slot] || emptySlotValue : null;

  const handleSave = async () => {
    const duplicatePlayer = getDuplicatePlayer(playersBySlot);
    const requiredSlots = activeFormation.slots.length || 11;

    if(duplicatePlayer){
      setError(`${duplicatePlayer.name || "This player"} is selected more than once.`);
      setMessage("");
      return;
    }

    if(filledSlots !== requiredSlots){
      setError(`Fill all ${requiredSlots} positions before saving. ${requiredSlots - filledSlots} still empty.`);
      setMessage("");
      return;
    }

    if(!dreamTeamId && dreamTeams.length >= maxDreamTeams){
      setError(`You can save up to ${maxDreamTeams} dream teams.`);
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("Saving dream team...");

    const teamPayload = {
      name: teamName,
      formation,
      players: buildPlayersPayload(playersBySlot),
    };
    const result = dreamTeamId
      ? await editDreamTeam({
        dreamTeamId,
        ...teamPayload,
      })
      : await createDreamTeam(teamPayload);

    if(result.ok){
      const dreamTeam = result.data?.dreamTeam;
      setDreamTeamId(dreamTeam?.dream_team_id || null);
      setTeamName(dreamTeam?.name || teamName);
      setFormation(dreamTeam?.formation || formation);
      setPlayersBySlot(normalizePlayersBySlot(dreamTeam?.players || []));
      setMaxDreamTeams(result.data?.maxDreamTeams || maxDreamTeams);
      if(dreamTeam){
        setDreamTeams((current) => {
          const existingIndex = current.findIndex((item) => item.dream_team_id === dreamTeam.dream_team_id);

          if(existingIndex === -1){
            return [dreamTeam, ...current];
          }

          return current.map((item) => item.dream_team_id === dreamTeam.dream_team_id ? dreamTeam : item);
        });
      }
      setMessage(result.data?.message || "Dream team saved successfully");
    }else{
      setError(result.data?.message || result.data?.error || "Failed to save dream team");
      setMessage("");
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if(!dreamTeamId){
      applyDreamTeam(null);
      return;
    }

    setDeleting(true);
    setError("");
    setMessage("Removing dream team...");

    const result = await removeDreamTeam({ dreamTeamId });

    if(result.ok){
      const remainingDreamTeams = dreamTeams.filter((item) => item.dream_team_id !== dreamTeamId);
      setDreamTeams(remainingDreamTeams);
      setMaxDreamTeams(result.data?.maxDreamTeams || maxDreamTeams);
      applyDreamTeam(remainingDreamTeams[0] || null);
      setMessage(result.data?.message || "Dream team removed successfully");
    }else{
      setError(result.data?.message || result.data?.error || "Failed to remove dream team");
      setMessage("");
    }

    setDeleting(false);
  };

  return {
    activeFormation,
    activeSlot,
    authLoading,
    clearSlot,
    closeSlotEditor,
    deleting,
    dreamTeamId,
    dreamTeams,
    error,
    filledSlots,
    formation,
    formations,
    handleCreateNewTeam,
    handleDelete,
    handleFormationChange,
    handlePlayerSearchChange,
    handleRoleFilterChange,
    handleSave,
    handleSelectDreamTeam,
    handleSelectSlot,
    isPlayerUsedInOtherSlot,
    loadDreamTeam,
    loading,
    maxDreamTeams,
    message,
    playerResults,
    playerRoleFilter,
    playerSearch,
    playerSearchLoading,
    playerSearchMessage,
    playersBySlot,
    saving,
    selectPlayerForSlot,
    selectedSlotPlayer,
    setTeamName,
    teamName,
    user,
  };
};
