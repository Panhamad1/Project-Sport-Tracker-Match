import crypto from "crypto";
import { NewsArticle } from "../models/index.js";
import { gNewsSearch } from "../providers/gNewsProvider.js";
import { formatNewsArticle } from "./newsService.js";

const defaultQuery = "football OR soccer";

const normalizeText = (value, defaultValue = "") => {
    const text = String(value ?? "").trim();

    return text || defaultValue;
};

const normalizeMax = (value) => {
    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue < 1) {
        return 10;
    }

    return Math.min(numberValue, 10);
};

const normalizePage = (value) => {
    const numberValue = Number(value);

    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : 1;
};

const getUrlHash = (url) => {
    return crypto.createHash("sha256").update(url).digest("hex");
};

const mapGNewsArticle = (article, { query, lang, syncedAt }) => {
    const title = normalizeText(article.title);
    const url = normalizeText(article.url);

    if (!title || !url) {
        return null;
    }

    const publishedAt = article.publishedAt ? new Date(article.publishedAt) : null;

    return {
        url_hash: getUrlHash(url),
        title,
        description: normalizeText(article.description, null),
        content: normalizeText(article.content, null),
        url,
        image: normalizeText(article.image, null),
        published_at: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
        source_name: normalizeText(article.source?.name, null),
        source_url: normalizeText(article.source?.url, null),
        language: normalizeText(article.lang, lang || "en"),
        provider: "gnews",
        keyword: query,
        raw_data: article,
        last_synced_at: syncedAt,
    };
};

const saveOrUpdateNewsArticle = async (articleData) => {
    const [article, created] = await NewsArticle.findOrCreate({
        where: {
            url_hash: articleData.url_hash,
        },
        defaults: articleData,
    });

    if (!created) {
        await article.update(articleData);
    }

    return {
        article,
        created,
    };
};

const syncNewsFromGNews = async ({
    q,
    lang = "en",
    country,
    max,
    page,
    sortby = "publishedAt",
} = {}) => {
    const query = normalizeText(q, process.env.GNEWS_DEFAULT_QUERY || defaultQuery);

    if (query.length > 200) {
        const error = new Error("GNews search query must be 200 characters or less");
        error.statusCode = 400;
        throw error;
    }

    const normalizedLang = normalizeText(lang, "en");
    const normalizedCountry = normalizeText(country);
    const normalizedMax = normalizeMax(max);
    const normalizedPage = normalizePage(page);
    const normalizedSort = sortby === "relevance" ? "relevance" : "publishedAt";
    const syncedAt = new Date();

    try {
        const data = await gNewsSearch({
            q: query,
            lang: normalizedLang,
            country: normalizedCountry || undefined,
            max: normalizedMax,
            page: normalizedPage,
            sortby: normalizedSort,
            in: "title,description",
            nullable: "description,content,image",
        });

        const articles = Array.isArray(data?.articles) ? data.articles : [];
        let createdCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;
        const savedArticles = [];

        for (const article of articles) {
            const articleData = mapGNewsArticle(article, {
                query,
                lang: normalizedLang,
                syncedAt,
            });

            if (!articleData) {
                skippedCount += 1;
                continue;
            }

            const savedArticle = await saveOrUpdateNewsArticle(articleData);

            if (savedArticle.created) {
                createdCount += 1;
            } else {
                updatedCount += 1;
            }

            savedArticles.push(formatNewsArticle(savedArticle.article));
        }

        const savedCount = createdCount + updatedCount;

        return {
            provider: "gnews",
            query,
            lang: normalizedLang,
            country: normalizedCountry || null,
            page: normalizedPage,
            requested_max: Number(max) || normalizedMax,
            max: normalizedMax,
            total_articles: data?.totalArticles ?? null,
            fetched_count: articles.length,
            saved_count: savedCount,
            created_count: createdCount,
            updated_count: updatedCount,
            skipped_count: skippedCount,
            articles: savedArticles,
            message: `News synced successfully: ${savedCount} article${savedCount === 1 ? "" : "s"} saved`,
        };
    } catch (error) {
        const syncError = new Error(`News sync error: ${error.message}`);
        syncError.statusCode = error.statusCode || 500;
        throw syncError;
    }
};

export { syncNewsFromGNews };
