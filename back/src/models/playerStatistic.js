import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PlayerStatistic = sequelize.define("PlayerStatistic",
    {
        player_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        league_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        season: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        rating: {
            type: DataTypes.STRING(20),
        },
        appearances: {
            type: DataTypes.INTEGER,
        },
        lineups: {
            type: DataTypes.INTEGER,
        },
        minutes: {
            type: DataTypes.INTEGER,
        },
        goals: {
            type: DataTypes.INTEGER,
        },
        assists: {
            type: DataTypes.INTEGER,
        },
        yellow_cards: {
            type: DataTypes.INTEGER,
        },
        red_cards: {
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
        tableName: "player_statistics",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["player_id", "team_id", "league_id", "season"],
            },
        ],
    },
);

export default PlayerStatistic;
