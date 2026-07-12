import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PredictionPick = sequelize.define("PredictionPick",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fixture_odd_id: {
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
        odd_snapshot: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        potential_points: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        points_awarded: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: null,
        },
        awarded_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "prediction_picks",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "fixture_id", "prediction_key"],
            },
            {
                fields: ["fixture_id", "points_awarded"],
            },
            {
                fields: ["fixture_odd_id"],
            },
        ],
    },
);

export default PredictionPick;
