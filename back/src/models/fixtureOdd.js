import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FixtureOdd = sequelize.define("FixtureOdd",
    {
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        market_type: {
            type: DataTypes.ENUM("WINNER", "OVER_UNDER"),
            allowNull: false,
        },
        prediction_key: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        selection_key: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        selection_label: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        line: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        odd: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        implied_probability: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: true,
        },
        bookmaker_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        bookmaker_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        raw_data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        last_synced_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "fixture_odds",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["fixture_id", "market_type", "selection_key"],
            },
            {
                fields: ["fixture_id", "prediction_key"],
            },
        ],
    },
);

export default FixtureOdd;
