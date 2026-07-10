import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const LeagueStanding = sequelize.define("LeagueStanding",
    {
        league_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        season: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rank: {
            type: DataTypes.INTEGER,
        },
        points: {
            type: DataTypes.INTEGER,
        },
        goals_diff: {
            type: DataTypes.INTEGER,
        },
        group_name: {
            type: DataTypes.STRING(100),
        },
        form: {
            type: DataTypes.STRING(50),
        },
        status: {
            type: DataTypes.STRING(50),
        },
        description: {
            type: DataTypes.STRING(255),
        },
        played: {
            type: DataTypes.INTEGER,
        },
        win: {
            type: DataTypes.INTEGER,
        },
        draw: {
            type: DataTypes.INTEGER,
        },
        lose: {
            type: DataTypes.INTEGER,
        },
        goals_for: {
            type: DataTypes.INTEGER,
        },
        goals_against: {
            type: DataTypes.INTEGER,
        },
        raw_data: {
            type: DataTypes.JSON,
        },
        last_updated: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "league_standings",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["league_id", "team_id", "season"],
            },
        ],
    }
);

export default LeagueStanding;
