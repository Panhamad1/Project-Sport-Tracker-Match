import { getPlayerById } from "../api/football/FootballApi";

export const fetchPlayerProfile = (playerApiId, { season } = {}) => {
  return getPlayerById(playerApiId, { season });
};
