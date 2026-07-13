import { Op } from "sequelize";
import { NewsArticle } from "../models/index.js";

const normalizeLimit = (limit, defaultValue = 12, maxValue = 40) => {
    const numberValue = Number(limit);

    if (!Number.isInteger(numberValue) || numberValue < 1) {
        return defaultValue;
    }

    return Math.min(numberValue, maxValue);
};

const formatNewsArticle = (article) => {
    if (!article) {
        return null;
    }

    const articleData = typeof article.toJSON === "function" ? article.toJSON() : article;

    return {
        id: articleData.id,
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        url: articleData.url,
        image: articleData.image,
        published_at: articleData.published_at,
        source_name: articleData.source_name,
        source_url: articleData.source_url,
        language: articleData.language,
        provider: articleData.provider,
        keyword: articleData.keyword,
        last_synced_at: articleData.last_synced_at,
    };
};

const getNewsArticlesFromDatabaseOnly = async ({ search = "", limit = 12 } = {}) => {
    const normalizedLimit = normalizeLimit(limit);
    const keyword = String(search || "").trim();
    const where = {};

    if (keyword) {
        where[Op.or] = [
            { title: { [Op.like]: `%${keyword}%` } },
            { description: { [Op.like]: `%${keyword}%` } },
            { source_name: { [Op.like]: `%${keyword}%` } },
        ];
    }

    const articles = await NewsArticle.findAll({
        where,
        order: [
            ["published_at", "DESC"],
            ["created_at", "DESC"],
        ],
        limit: normalizedLimit,
    });

    return {
        source: "database_only",
        count: articles.length,
        articles: articles.map(formatNewsArticle),
    };
};

export { formatNewsArticle, getNewsArticlesFromDatabaseOnly };
