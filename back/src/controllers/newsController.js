import { getNewsArticlesFromDatabaseOnly } from "../services/newsService.js";

const getNewsArticles = async (req, res) => {
    try {
        const result = await getNewsArticlesFromDatabaseOnly({
            search: req.query.search,
            limit: req.query.limit,
        });

        return res.status(200).json({
            message: result.count > 0 ? "News articles loaded successfully" : "No news articles saved yet",
            ...result,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load news articles",
            error: error.message,
        });
    }
};

export { getNewsArticles };
