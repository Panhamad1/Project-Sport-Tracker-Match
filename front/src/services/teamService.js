import { addFavoriteTeam, getFavoriteTeams, removeFavoriteTeam } from "../api/football/FavoriteTeamApi";
import { getTeamById } from "../api/football/FootballApi";

export const fetchTeamProfile = (teamApiId, { season } = {}) => {
  return getTeamById(teamApiId, { season });
};

export const fetchFavoriteTeams = () => {
  return getFavoriteTeams();
};

export const addTeamToFavorites = (teamId) => {
  return addFavoriteTeam(teamId);
};

export const removeTeamFromFavorites = (teamId) => {
  return removeFavoriteTeam(teamId);
};
