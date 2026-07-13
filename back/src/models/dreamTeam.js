import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const DreamTeam = sequelize.define("DreamTeam",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: "My Dream Team",
        },
        formation: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "4-3-3",
        },
        players: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        tableName: "dream_teams",
        underscored: true,
        indexes: [
            {
                fields: ["user_id"],
            },
        ],
    },
);

export default DreamTeam;
