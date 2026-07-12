import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PinnedMatch = sequelize.define("PinnedMatch",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "pinned_matches",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "fixture_id"],
            },
        ],
    },
);

export default PinnedMatch;
