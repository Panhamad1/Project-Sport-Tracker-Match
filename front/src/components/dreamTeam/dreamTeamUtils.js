export const defaultFormation = "4-3-3";
export const defaultMaxDreamTeams = 3;

export const playerRoleFilters = [
  { value: "ALL", label: "All" },
  { value: "GK", label: "GK" },
  { value: "DEF", label: "DEF" },
  { value: "MID", label: "MID" },
  { value: "FWD", label: "FWD" },
];

export const emptySlotValue = {
  api_player_id: "",
  name: "",
  photo: "",
  nationality: "",
};

export const normalizePlayersBySlot = (players = []) => {
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

export const buildPlayersPayload = (playersBySlot) => {
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

export const getDuplicatePlayer = (playersBySlot) => {
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

export const getPlayerDisplayName = (player) => {
  return player?.display_name || player?.full_name || player?.name || "";
};
