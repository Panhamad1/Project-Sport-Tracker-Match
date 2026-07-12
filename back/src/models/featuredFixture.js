import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FeaturedFixture = sequelize.define("FeaturedFixture",
    {
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        featured_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        label: {
            type: DataTypes.STRING(100),
        },
        selected_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "featured_fixtures",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["fixture_id", "featured_date"],
            },
            {
                fields: ["featured_date", "priority"],
            },
            {
                fields: ["selected_by"],
            },
        ],
    },
);

export default FeaturedFixture;
