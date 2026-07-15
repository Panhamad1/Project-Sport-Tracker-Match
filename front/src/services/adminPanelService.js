import {
  syncFixture,
  syncFixtures,
  syncMatchDetails,
  syncMatchDetailsByDate,
  syncNews,
  syncPlayer,
  syncPlayers,
  syncTeam,
  syncStandings,
  syncTeams,
} from "../api/admin/AdminSyncApi";

export const runFixtureSync = (values) => syncFixtures(values);
export const runSingleFixtureSync = (values) => syncFixture(values);
export const runMatchDetailSync = (values) => syncMatchDetails(values);
export const runMatchDetailSyncByDate = (values) => syncMatchDetailsByDate(values);
export const runNewsSync = (values) => syncNews(values);
export const runPlayerSync = (values) => syncPlayer(values);
export const runPlayersSync = (values) => syncPlayers(values);
export const runStandingsSync = (values) => syncStandings(values);
export const runTeamSync = (values) => syncTeam(values);
export const runTeamsSync = (values) => syncTeams(values);
