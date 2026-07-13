// relationship script
import sequelize from "../config/database.js";
import User from "./user.js";
import League from "./league.js";
import Fixture from "./fixture.js";
import Team from "./team.js";
import FixtureSyncLog from "./fixtureSyncLog.js";
import FavoriteTeam from "./favoriteTeam.js";
import PinnedMatch from "./pinnedMatch.js";
import Player from "./player.js";
import PlayerStatistic from "./playerStatistic.js";
import MatchDetail from "./matchDetail.js";
import LeagueStanding from "./leagueStanding.js";
import StreamLink from "./streamLink.js";
import FeaturedFixture from "./featuredFixture.js";
import Prediction from "./prediction.js";
import DreamTeam from "./dreamTeam.js";
import FixtureOdd from "./fixtureOdd.js";
import PredictionPick from "./predictionPick.js";
import Notification from "./notification.js";
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
User.hasMany(PinnedMatch, {
    foreignKey: "user_id",
    as: "pinnedMatches",
    onDelete: "CASCADE",
});
PinnedMatch.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});
Fixture.hasMany(PinnedMatch, {
    foreignKey: "fixture_id",
    as: "pinnedMatchRecords",
    onDelete: "CASCADE",
});
PinnedMatch.belongsTo(Fixture, {
    foreignKey: "fixture_id",
    as: "fixture",
});
User.hasMany(StreamLink, {
    foreignKey: "added_by",
    as: "addedStreamLinks",
    onDelete: "CASCADE",
});
StreamLink.belongsTo(User, {
    foreignKey: "added_by",
    as: "admin",
});
Fixture.hasMany(StreamLink, {
    foreignKey: "fixture_id",
    as: "streamLinks",
    onDelete: "CASCADE",
});
StreamLink.belongsTo(Fixture, {
    foreignKey: "fixture_id",
    as: "fixture",
});
User.hasMany(FeaturedFixture, {
    foreignKey: "selected_by",
    as: "selectedFeaturedFixtures",
    onDelete: "CASCADE",
});
FeaturedFixture.belongsTo(User, {
    foreignKey: "selected_by",
    as: "selector",
});
Fixture.hasMany(FeaturedFixture, {
    foreignKey: "fixture_id",
    as: "featuredFixtureRecords",
    onDelete: "CASCADE",
});
FeaturedFixture.belongsTo(Fixture, {
    foreignKey: "fixture_id",
    as: "fixture",
});
User.hasMany(Prediction, {
    foreignKey: "user_id",
    as: "predictions",
    onDelete: "CASCADE",
});
Prediction.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});
Fixture.hasMany(Prediction, {
    foreignKey: "fixture_id",
    as: "predictionRecords",
    onDelete: "CASCADE",
});
Prediction.belongsTo(Fixture, {
    foreignKey: "fixture_id",
    as: "fixture",
});
Fixture.hasMany(FixtureOdd, {
    foreignKey: "fixture_id",
    as: "odds",
    onDelete: "CASCADE",
});
FixtureOdd.belongsTo(Fixture, {
    foreignKey: "fixture_id",
    as: "fixture",
});
User.hasMany(PredictionPick, {
    foreignKey: "user_id",
    as: "predictionPicks",
    onDelete: "CASCADE",
});
PredictionPick.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});
Fixture.hasMany(PredictionPick, {
    foreignKey: "fixture_id",
    as: "predictionPicks",
    onDelete: "CASCADE",
});
PredictionPick.belongsTo(Fixture, {
    foreignKey: "fixture_id",
    as: "fixture",
});
FixtureOdd.hasMany(PredictionPick, {
    foreignKey: "fixture_odd_id",
    as: "predictionPicks",
    onDelete: "CASCADE",
});
PredictionPick.belongsTo(FixtureOdd, {
    foreignKey: "fixture_odd_id",
    as: "odd",
});
User.hasMany(Notification, {
    foreignKey: "user_id",
    as: "notifications",
    onDelete: "CASCADE",
});
Notification.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});
Fixture.hasMany(Notification, {
    foreignKey: "fixture_id",
    as: "notifications",
    onDelete: "CASCADE",
});
Notification.belongsTo(Fixture, {
    foreignKey: "fixture_id",
    as: "fixture",
});
PredictionPick.hasMany(Notification, {
    foreignKey: "prediction_pick_id",
    as: "notifications",
    onDelete: "CASCADE",
});
Notification.belongsTo(PredictionPick, {
    foreignKey: "prediction_pick_id",
    as: "predictionPick",
});
User.hasMany(DreamTeam, {
    foreignKey: "user_id",
    as: "dreamTeams",
    onDelete: "CASCADE",
});
DreamTeam.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
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


export { sequelize, User, League, Team, Fixture, FixtureSyncLog, FavoriteTeam, PinnedMatch, Player, PlayerStatistic, MatchDetail, LeagueStanding, StreamLink, FeaturedFixture, Prediction, DreamTeam, FixtureOdd, PredictionPick, Notification };
