import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Player = sequelize.define("Player",
    {
        api_player_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        firstname:{
            type: DataTypes.STRING(100),
        },
        lastname:{
            type: DataTypes.STRING(100),
        },
        age:{
            type: DataTypes.INTEGER,
        },
        nationality:{
            type: DataTypes.STRING(100),
        },
        height:{
            type: DataTypes.STRING(50),
        },
        weight:{
            type: DataTypes.STRING(50),
        },
        injured: {
            type: DataTypes.BOOLEAN,
        },
        photo:{
            type: DataTypes.STRING(255),
        },
        raw_data:{
            type: DataTypes.JSON,
        },
        last_updated:{
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "players",
        underscored:true,
    }
);
export default Player;