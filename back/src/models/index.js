// relationship script
import sequelize from "../config/database.js";
import User from "./user.js";
import League from "./league.js";
import Fixture from "./fixture.js";
import Team from "./team.js";
import FixtureSyncLog from "./fixtureSyncLog.js";
import FavoriteTeam from "./favoriteTeam.js";
import Player from "./player.js";
import PlayerStatistic from "./playerStatistic.js";
import MatchDetail from "./matchDetail.js";
import LeagueStanding from "./leagueStanding.js";
League.hasMany(Fixture,{
    foreignKey: "league_id",
    as:"fixtures",
});
Fixture.belongsTo(League,{
    foreignKey: "league_id",
    as: "league",
});
League.hasMany(LeagueStanding, {
    foreignKey: "league_id",
    as: "standings",
    onDelete: "CASCADE",
});
LeagueStanding.belongsTo(League, {
    foreignKey: "league_id",
    as: "league",
});
Team.hasMany(Fixture, {
    foreignKey: "home_team_id",
    as: "homeFixtures",
});
Fixture.belongsTo(Team,{
    foreignKey:"home_team_id",
    as:"homeTeam",
});
Team.hasMany(Fixture, {
    foreignKey: "away_team_id",
    as: "awayFixtures",
});
Fixture.belongsTo(Team, {
    foreignKey: "away_team_id",
    as: "awayTeam",
});
Fixture.hasOne(MatchDetail, {
    foreignKey: "fixture_id",
    as: "detail",
    onDelete: "CASCADE",
});
MatchDetail.belongsTo(Fixture, {
    foreignKey: "fixture_id",
    as: "fixture",
});
User.hasMany(FavoriteTeam,{
    foreignKey: "user_id",
    as: "favoriteTeams",
    onDelete: "CASCADE",
});
FavoriteTeam.belongsTo(User,{
    foreignKey: "user_id",
    as: "user",
});
Team.hasMany(FavoriteTeam,{
    foreignKey: "team_id",
    onDelete:"CASCADE",
    as:"favoriteTeamRecords",
});
FavoriteTeam.belongsTo(Team,{
    foreignKey:"team_id",
    as:"team",
});
Player.hasMany(PlayerStatistic,{
    foreignKey:"player_id",
    as: "statistics",
    onDelete: "CASCADE",
});
PlayerStatistic.belongsTo(Player, {
    foreignKey: "player_id",
    as: "player",
});

Team.hasMany(PlayerStatistic, {
    foreignKey: "team_id",
    as: "playerStatistics",
    onDelete: "CASCADE",
});

PlayerStatistic.belongsTo(Team, {
    foreignKey: "team_id",
    as: "team",
});
Team.hasMany(LeagueStanding, {
    foreignKey: "team_id",
    as: "leagueStandings",
    onDelete: "CASCADE",
});
LeagueStanding.belongsTo(Team, {
    foreignKey: "team_id",
    as: "team",
});

League.hasMany(PlayerStatistic, {
    foreignKey: "league_id",
    as: "playerStatistics",
    onDelete: "CASCADE",
});

PlayerStatistic.belongsTo(League, {
    foreignKey: "league_id",
    as: "league",
});


export { sequelize, User, League, Team, Fixture, FixtureSyncLog, FavoriteTeam, Player, PlayerStatistic, MatchDetail, LeagueStanding };
