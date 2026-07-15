import { getLeagueStandings } from "../api/football/FootballApi";

export const fetchLeagueStandings = ({ league, season }) => {
  return getLeagueStandings({ league, season });
};
