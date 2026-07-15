import {
  deleteDreamTeam,
  getDreamTeamFormations,
  getMyDreamTeam,
  saveDreamTeam,
  updateDreamTeam,
} from "../api/football/DreamTeamApi";
import { searchFootball } from "../api/football/FootballApi";

export const fetchDreamTeamFormations = () => {
  return getDreamTeamFormations();
};

export const fetchMyDreamTeams = () => {
  return getMyDreamTeam();
};

export const createDreamTeam = (payload) => {
  return saveDreamTeam(payload);
};

export const editDreamTeam = (payload) => {
  return updateDreamTeam(payload);
};

export const removeDreamTeam = (payload) => {
  return deleteDreamTeam(payload);
};

export const searchDreamTeamPlayers = ({ search, position }) => {
  return searchFootball({
    search,
    type: "players",
    position,
  });
};
