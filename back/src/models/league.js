import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const League = sequelize.define("League",{
        api_league_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        type:{
            type: DataTypes.STRING(50),
        },
        logo: {
            type: DataTypes.STRING(255),
        },
        country: {
            type: DataTypes.STRING(100),
        },
        season: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        raw_data: {
            type: DataTypes.JSON
        },
        last_updated: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "leagues",
        underscored: true,
        indexes: [
            {
                unique:true,
                fields: ["api_league_id", "season"],
            },
        ],
    }
);
export default League;