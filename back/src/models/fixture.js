import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Fixture = sequelize.define("Fixture",
    {
      api_fixture_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },

      league_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      season: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      home_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      away_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      match_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      status_long: {
        type: DataTypes.STRING(100),
      },

      status_short: {
        type: DataTypes.STRING(20),
      },

      elapsed: {
        type: DataTypes.INTEGER,
      },

      home_goals: {
        type: DataTypes.INTEGER,
      },

      away_goals: {
        type: DataTypes.INTEGER,
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
      tableName: "fixtures",
      underscored: true,
    }
);

export default Fixture;