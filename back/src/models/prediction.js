import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Prediction = sequelize.define("Prediction",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        predicted_home_goals: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        predicted_away_goals: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        points_awarded: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        awarded_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "predictions",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "fixture_id"],
            },
            {
                fields: ["fixture_id"],
            },
            {
                fields: ["points_awarded"],
            },
        ],
    },
);

export default Prediction;
