import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Team = sequelize.define("Team",
    {
      api_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      code: {
        type: DataTypes.STRING(20),
      },

      country: {
        type: DataTypes.STRING(100),
      },

      founded: {
        type: DataTypes.INTEGER,
      },

      logo: {
        type: DataTypes.STRING(255),
      },

      venue_name: {
        type: DataTypes.STRING(150),
      },

      venue_city: {
        type: DataTypes.STRING(100),
      },

      raw_data: {
        type: DataTypes.JSON,
      },

      last_updated: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "teams",
      underscored: true,
    }
);

export default Team;