import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notification = sequelize.define("Notification",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        prediction_pick_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM("PINNED_MATCH_START", "PREDICTION_RESULT"),
            allowNull: false,
        },
        reference_key: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        tableName: "notifications",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "reference_key"],
            },
            {
                fields: ["user_id", "is_read"],
            },
            {
                fields: ["fixture_id"],
            },
        ],
    },
);

export default Notification;
