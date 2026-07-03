// relationship script
import sequelize from "../config/database.js";
import User from "./user.js";
import League from "./league.js";
import Fixture from "./fixture.js";
import Team from "./team.js";
import FixtureSyncLog from "./fixtureSyncLog.js";

League.hasMany(Fixture,{
    foreignKey: "league_id",
    as:"fixtures",
});
Fixture.belongsTo(League,{
    foreignKey: "league_id",
    as: "league,"
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


export { sequelize, User, League, Team, Fixture, FixtureSyncLog };