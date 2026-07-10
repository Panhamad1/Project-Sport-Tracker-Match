import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FavoriteTeam = sequelize.define("FavoriteTeam",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
    },
    {
        tableName: "favorite_teams",
        underscored: true,
        indexes:[
            {
                unique: true,
                fields: ["user_id","team_id"],
            },
       ],
    }
);

export default FavoriteTeam;