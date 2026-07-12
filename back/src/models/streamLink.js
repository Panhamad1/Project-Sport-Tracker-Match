import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StreamLink = sequelize.define("StreamLink",
    {
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        source_name: {
            type: DataTypes.STRING(100),
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        added_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "stream_links",
        underscored: true,
        indexes: [
            {
                fields: ["fixture_id", "is_active"],
            },
            {
                fields: ["added_by"],
            },
        ],
    },
);

export default StreamLink;
