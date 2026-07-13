import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const NewsArticle = sequelize.define("NewsArticle",
    {
        url_hash: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        published_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        source_name: {
            type: DataTypes.STRING(120),
            allowNull: true,
        },
        source_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        language: {
            type: DataTypes.STRING(10),
            allowNull: true,
            defaultValue: "en",
        },
        provider: {
            type: DataTypes.STRING(40),
            allowNull: false,
            defaultValue: "gnews",
        },
        keyword: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        raw_data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        last_synced_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "news_articles",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["url_hash"],
            },
            {
                fields: ["published_at"],
            },
            {
                fields: ["provider"],
            },
            {
                fields: ["source_name"],
            },
        ],
    },
);

export default NewsArticle;
