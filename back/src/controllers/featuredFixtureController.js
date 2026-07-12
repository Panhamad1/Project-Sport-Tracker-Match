import {
    addFeaturedFixtureService,
    deleteFeaturedFixtureService,
    getTopMatchService,
    updateFeaturedFixtureService,
} from "../services/featuredFixtureService.js";

const isValidDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const getPositiveIntegerParam = (value) => {
    const numberValue = Number(value);

    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const normalizePriority = (value, defaultValue = 1) => {
    const priority = value === undefined || value === null || value === ""
        ? defaultValue
        : Number(value);

    if (!Number.isInteger(priority) || priority < 1) {
        return {
            error: "Priority must be a positive integer",
        };
    }

    return {
        value: priority,
    };
};

const normalizeFeaturedFixtureBody = (body, query = {}, { partial = false } = {}) => {
    const values = {};
    const featuredDate = body.featured_date || query.date;

    if (featuredDate !== undefined) {
        const date = String(featuredDate || "").trim();

        if (!isValidDate(date)) {
            return {
                error: "featured_date must use YYYY-MM-DD",
            };
        }

        values.featured_date = date;
    }

    if (!partial || body.priority !== undefined) {
        const normalizedPriority = normalizePriority(body.priority);

        if (normalizedPriority.error) {
            return {
                error: normalizedPriority.error,
            };
        }

        values.priority = normalizedPriority.value;
    }

    if (body.label !== undefined) {
        const label = String(body.label || "").trim();

        if (label.length > 100) {
            return {
                error: "Label must be 100 characters or less",
            };
        }

        values.label = label || null;
    } else if (!partial) {
        values.label = null;
    }

    if (partial && Object.keys(values).length === 0) {
        return {
            error: "No valid featured fixture fields provided",
        };
    }

    return {
        values,
    };
};

const getTopMatch = async (req, res) => {
    try {
        const topMatch = await getTopMatchService();

        return res.status(200).json({
            message: topMatch ? "Top match loaded successfully" : "No top match selected yet",
            source: "database_only",
            count: topMatch ? 1 : 0,
            topMatch,
            featuredFixtures: topMatch ? [topMatch] : [],
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load top match",
            error: error.message,
        });
    }
};

const getAdminTopMatch = async (req, res) => {
    try {
        const topMatch = await getTopMatchService({
            admin: true,
        });

        return res.status(200).json({
            message: topMatch ? "Top match loaded successfully" : "No top match selected yet",
            count: topMatch ? 1 : 0,
            topMatch,
            featuredFixtures: topMatch ? [topMatch] : [],
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load admin top match",
            error: error.message,
        });
    }
};

const addFeaturedFixture = async (req, res) => {
    try {
        const adminUserId = req.user.id;
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const normalizedBody = normalizeFeaturedFixtureBody(req.body, req.query);

        if (normalizedBody.error) {
            return res.status(400).json({
                message: normalizedBody.error,
            });
        }

        const result = await addFeaturedFixtureService(adminUserId, apiFixtureId, normalizedBody.values);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(result.created ? 201 : 200).json({
            message: result.created ? "Top match selected successfully" : "Top match changed successfully",
            featuredFixture: result.featuredFixture,
            topMatch: result.featuredFixture,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to set top match",
            error: error.message,
        });
    }
};

const updateFeaturedFixture = async (req, res) => {
    try {
        const featuredFixtureId = getPositiveIntegerParam(req.params.featuredFixtureId);

        if (!featuredFixtureId) {
            return res.status(400).json({
                message: "Invalid featured fixture id",
            });
        }

        const normalizedBody = normalizeFeaturedFixtureBody(req.body, req.query, {
            partial: true,
        });

        if (normalizedBody.error) {
            return res.status(400).json({
                message: normalizedBody.error,
            });
        }

        const result = await updateFeaturedFixtureService(featuredFixtureId, normalizedBody.values);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: "Top match updated successfully",
            featuredFixture: result.featuredFixture,
            topMatch: result.featuredFixture,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update top match",
            error: error.message,
        });
    }
};

const deleteFeaturedFixture = async (req, res) => {
    try {
        const featuredFixtureId = getPositiveIntegerParam(req.params.featuredFixtureId);

        if (!featuredFixtureId) {
            return res.status(400).json({
                message: "Invalid featured fixture id",
            });
        }

        const result = await deleteFeaturedFixtureService(featuredFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: result.message,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to remove top match",
            error: error.message,
        });
    }
};

export {
    addFeaturedFixture,
    deleteFeaturedFixture,
    getAdminTopMatch,
    getTopMatch,
    updateFeaturedFixture,
};
