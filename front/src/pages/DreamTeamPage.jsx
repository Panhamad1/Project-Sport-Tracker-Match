import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaSave,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaSyncAlt,
  FaTimes,
  FaTrash,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import {
  deleteDreamTeam,
  getDreamTeamFormations,
  getMyDreamTeam,
  saveDreamTeam,
  updateDreamTeam,
} from "../api/football/DreamTeamApi";
import { searchFootball } from "../api/football/FootballApi";
import PanelCard from "../components/common/PanelCard";
import NoDataState from "../components/matches/NoDataState";
import { useAuth } from "../hooks/useAuth";

const defaultFormation = "4-3-3";
const defaultMaxDreamTeams = 3;

const playerRoleFilters = [
  { value: "ALL", label: "All" },
  { value: "GK", label: "GK" },
  { value: "DEF", label: "DEF" },
  { value: "MID", label: "MID" },
  { value: "FWD", label: "FWD" },
];

const emptySlotValue = {
  api_player_id: "",
  name: "",
  photo: "",
  nationality: "",
};

const normalizePlayersBySlot = (players = []) => {
  return players.reduce((map, player) => {
    map[player.slot] = {
      api_player_id: player.api_player_id || "",
      name: player.name || "",
      photo: player.photo || "",
      nationality: player.nationality || "",
    };
    return map;
  }, {});
};

const buildPlayersPayload = (playersBySlot) => {
  return Object.entries(playersBySlot)
    .filter(([, player]) => player.api_player_id || player.name)
    .map(([slot, player]) => ({
      slot,
      api_player_id: Number(player.api_player_id || 0) || undefined,
      name: player.name || undefined,
      photo: player.photo || undefined,
      nationality: player.nationality || undefined,
    }));
};

const getDuplicatePlayer = (playersBySlot) => {
  const usedPlayerIds = new Set();

  for (const player of Object.values(playersBySlot)) {
    if(!player.api_player_id){
      continue;
    }

    const playerId = Number(player.api_player_id);

    if(usedPlayerIds.has(playerId)){
      return player;
    }

    usedPlayerIds.add(playerId);
  }

  return null;
};

const getPlayerDisplayName = (player) => {
  return player?.display_name || player?.full_name || player?.name || "";
};

const SlotPlayer = ({ player, slot }) => {
  if(player?.photo){
    return (
      <img
        src={player.photo}
        alt=""
        className="mx-auto h-10 w-10 rounded-full border border-white/20 object-cover"
      />
    );
  }

  return (
    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xs font-bold text-white">
      {player?.name ? player.name.slice(0, 2).toUpperCase() : slot.slot}
    </span>
  );
};

const PlayerSearchResult = ({ alreadyUsed, onSelect, player }) => {
  const displayName = getPlayerDisplayName(player);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={alreadyUsed}
      className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-all ${
        alreadyUsed
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-[#1a1a1a]"
      }`}
    >
      {player.photo ? (
        <img src={player.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-[#a78bfa]">
          <FaUser />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
        <p className="text-xs text-gray-500">
          {alreadyUsed
            ? "Already selected"
            : [player.position, player.nationality, player.age ? `${player.age} years old` : null].filter(Boolean).join(" - ") || "Saved player"}
        </p>
      </div>
    </button>
  );
};

const DreamTeamPage = () => {
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
      getDreamTeamFormations(),
      getMyDreamTeam(),
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

      const result = await searchFootball({
        search: keyword,
        type: "players",
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
      ? await updateDreamTeam({
        dreamTeamId,
        ...teamPayload,
      })
      : await saveDreamTeam(teamPayload);

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

    const result = await deleteDreamTeam({ dreamTeamId });

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

  const filledSlots = Object.values(playersBySlot).filter((player) => player.api_player_id || player.name).length;
  const selectedSlotPlayer = activeSlot ? playersBySlot[activeSlot.slot] || emptySlotValue : null;

  if(authLoading){
    return (
      <div className="flex items-center gap-3 text-white">
        <FaSpinner className="animate-spin text-[#8b5cf6]" />
        Checking account...
      </div>
    );
  }

  if(!user){
    return (
      <div className="text-white">
        <NoDataState
          title="Login Required"
          message="Login to build and save your dream team."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-[#8b5cf6]">Dream Team</p>
          <h1 className="mt-1 text-2xl font-bold">Dream Team Builder</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Pick a formation, place players into each slot, and save your personal football lineup.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadDreamTeam}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
            Refresh
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:bg-[#3f315f]"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            Save Team
          </button>
        </div>
      </div>

      {(message || error) && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${
          error
            ? "border-red-500/30 bg-red-500/10 text-red-200"
            : "border-[#8b5cf6]/30 bg-[#8b5cf6]/10 text-[#d8b4fe]"
        }`}>
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <PanelCard className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2a2a] p-5">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 font-semibold">
                <FaUsers className="text-[#8b5cf6]" />
                {teamName || "My Dream Team"}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {formation} - {filledSlots}/{activeFormation.slots.length || 11} slots filled
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {formations.map((item) => (
                <button
                  key={item.formation}
                  type="button"
                  onClick={() => handleFormationChange(item.formation)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    formation === item.formation
                      ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                      : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:text-white"
                  }`}
                >
                  {item.formation}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div className="relative min-h-155 overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-900">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-size-[64px_64px]"></div>
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20"></div>
              <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"></div>
              <div className="absolute bottom-0 left-1/2 h-24 w-52 -translate-x-1/2 rounded-t-lg border border-b-0 border-white/20"></div>

              {activeFormation.slots.map((slot) => {
                const player = playersBySlot[slot.slot];

                return (
                  <button
                    key={slot.slot}
                    type="button"
                    onClick={() => handleSelectSlot(slot)}
                    className={`absolute w-28 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-2 text-center shadow-lg backdrop-blur transition-all ${
                      activeSlot?.slot === slot.slot
                        ? "border-white bg-white/20"
                        : "border-white/15 bg-black/25 hover:border-white/40 hover:bg-black/35"
                    }`}
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                    }}
                  >
                    <SlotPlayer player={player} slot={slot} />
                    <p className="mt-1 truncate text-xs font-semibold text-white">
                      {player?.name || slot.slot}
                    </p>
                    <p className="text-[10px] text-emerald-100/70">{slot.position}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </PanelCard>

        <div className="space-y-5">
          <PanelCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Team Settings</h2>
              <span className="rounded-full bg-[#1a1a1a] px-2 py-1 text-xs text-gray-400">
                {dreamTeams.length}/{maxDreamTeams}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {dreamTeams.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dreamTeams.map((dreamTeam) => (
                    <button
                      key={dreamTeam.dream_team_id}
                      type="button"
                      onClick={() => handleSelectDreamTeam(dreamTeam)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        dreamTeamId === dreamTeam.dream_team_id
                          ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                          : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:text-white"
                      }`}
                    >
                      {dreamTeam.name || "Dream Team"}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleCreateNewTeam}
                disabled={dreamTeams.length >= maxDreamTeams || loading || saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-[#1a1a1a] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaPlus />
                New Team
              </button>
            </div>

            <label className="mt-4 block text-sm text-gray-300">
              Team Name
              <input
                type="text"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#8b5cf6] focus:outline-none"
              />
            </label>

            <label className="mt-4 block text-sm text-gray-300">
              Formation
              <select
                value={formation}
                onChange={(event) => handleFormationChange(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#8b5cf6] focus:outline-none"
              >
                {formations.map((item) => (
                  <option key={item.formation} value={item.formation}>{item.formation}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
              {dreamTeamId ? "Delete Team" : "Clear Draft"}
            </button>
          </PanelCard>

          <PanelCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Selected Slot</h2>
              {activeSlot && (
                <button
                  type="button"
                  onClick={closeSlotEditor}
                  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#1a1a1a] hover:text-white"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {!activeSlot ? (
              <p className="mt-4 text-sm text-gray-400">Click a position on the pitch to edit that player.</p>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3">
                  <p className="text-sm font-semibold text-white">{activeSlot.slot}</p>
                  <p className="mt-1 text-xs text-gray-500">{activeSlot.position} position</p>
                </div>

                {selectedSlotPlayer.api_player_id && (
                  <div className="flex items-center gap-3 rounded-lg border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-3">
                    {selectedSlotPlayer.photo ? (
                      <img src={selectedSlotPlayer.photo} alt="" className="h-11 w-11 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1a1a] text-[#a78bfa]">
                        <FaUser />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{selectedSlotPlayer.name}</p>
                      <p className="text-xs text-gray-400">{selectedSlotPlayer.nationality || "Saved player"}</p>
                    </div>
                  </div>
                )}

                <label className="block text-sm text-gray-300">
                  Search Player
                  <div className="relative mt-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500" />
                    <input
                      type="text"
                      value={playerSearch}
                      onChange={(event) => handlePlayerSearchChange(event.target.value)}
                      placeholder="Search player name"
                      className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-9 py-2 text-sm text-white focus:border-[#8b5cf6] focus:outline-none"
                    />
                    {playerSearchLoading && (
                      <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-sm text-[#8b5cf6]" />
                    )}
                  </div>
                </label>

                <div className="flex flex-wrap gap-2">
                  {playerRoleFilters.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => {
                        setPlayerRoleFilter(filter.value);
                        setPlayerResults([]);
                        setPlayerSearchMessage("");
                      }}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        playerRoleFilter === filter.value
                          ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                          : "border-[#2a2a2a] bg-[#111111] text-gray-400 hover:text-white"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {playerSearchMessage && (
                  <p className="text-xs text-gray-500">{playerSearchMessage}</p>
                )}

                {playerResults.length > 0 && (
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#111111] p-2">
                    {playerResults.map((player) => {
                      const alreadyUsed = isPlayerUsedInOtherSlot(player.api_player_id, activeSlot.slot);

                      return (
                        <PlayerSearchResult
                          key={player.api_player_id}
                          alreadyUsed={alreadyUsed}
                          player={player}
                          onSelect={() => selectPlayerForSlot(activeSlot.slot, player)}
                        />
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => clearSlot(activeSlot.slot)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-[#1a1a1a] hover:text-white"
                >
                  <FaTimes />
                  Clear Slot
                </button>
              </div>
            )}
          </PanelCard>
        </div>
      </div>
    </div>
  );
};

export default DreamTeamPage;
