import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MatchDetail = sequelize.define("MatchDetail",
    {
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        h2h: {
            type: DataTypes.JSON,
        },
        prediction: {
            type: DataTypes.JSON,
        },
        lineups: {
            type: DataTypes.JSON,
        },
        statistics: {
            type: DataTypes.JSON,
        },
        streams: {
            type: DataTypes.JSON,
        },
        raw_data: {
            type: DataTypes.JSON,
        },
        last_synced_at: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "match_details",
        underscored: true,
    }
);

export default MatchDetail;
