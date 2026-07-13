import { syncNewsFromGNews } from "../services/newsSyncService.js";

const syncNews = async (req, res) => {
    try {
        const result = await syncNewsFromGNews({
            q: req.query.q,
            lang: req.query.lang,
            country: req.query.country,
            max: req.query.max,
            page: req.query.page,
            sortby: req.query.sortby,
        });

        return res.status(200).json({
            message: result.message,
            source: "gnews_admin_sync",
            ...result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: "Failed to sync news",
            source: "gnews_admin_sync_failed",
            error: error.message,
        });
    }
};

export { syncNews };
