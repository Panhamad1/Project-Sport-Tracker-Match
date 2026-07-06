import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FixtureSyncLog = sequelize.define("fixtureSyncLog",
    {
        sync_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM("success","failed"),
            allowNull: false,
            defaultValue: "success",
        },
        fixture_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        error_message: {
            type: DataTypes.TEXT,
        },
        last_synced_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "fixture_sync_logs",
        underscored: true,
    }
);

export default FixtureSyncLog;