import { getFixturesByDate, getMatchById } from "../api/football/FootballApi";

export const fetchFixturesByDate = (date) => {
  return getFixturesByDate(date);
};

export const fetchMatchById = (apiFixtureId) => {
  return getMatchById(apiFixtureId);
};
