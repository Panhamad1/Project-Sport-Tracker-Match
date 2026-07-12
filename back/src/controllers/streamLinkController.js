import {
    addStreamLinkService,
    deleteStreamLinkService,
    getAdminStreamLinksByApiFixtureIdService,
    getPublicStreamLinksByApiFixtureIdService,
    updateStreamLinkService,
} from "../services/streamLinkService.js";

const getPositiveIntegerParam = (value) => {
    const numberValue = Number(value);

    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const isValidHttpUrl = (url) => {
    try {
        const parsedUrl = new URL(url);

        return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
        return false;
    }
};

const normalizeBooleanValue = (value) => {
    if (typeof value === "boolean") {
        return {
            value,
        };
    }

    if (typeof value === "string") {
        const loweredValue = value.toLowerCase().trim();

        if (loweredValue === "true") {
            return {
                value: true,
            };
        }

        if (loweredValue === "false") {
            return {
                value: false,
            };
        }
    }

    if (typeof value === "number" && [0, 1].includes(value)) {
        return {
            value: Boolean(value),
        };
    }

    return {
        error: "is_active must be true or false",
    };
};

const normalizeStreamLinkBody = (body, { partial = false } = {}) => {
    const values = {};

    if (!partial || body.title !== undefined) {
        const title = String(body.title || "").trim();

        if (!title) {
            return {
                error: "Stream title is required",
            };
        }

        values.title = title;
    }

    if (!partial || body.url !== undefined) {
        const url = String(body.url || "").trim();

        if (!url) {
            return {
                error: "Stream URL is required",
            };
        }

        if (!isValidHttpUrl(url)) {
            return {
                error: "Stream URL must start with http:// or https://",
            };
        }

        values.url = url;
    }

    if (body.source_name !== undefined) {
        values.source_name = String(body.source_name || "").trim() || null;
    }

    if (body.is_active !== undefined) {
        const normalizedIsActive = normalizeBooleanValue(body.is_active);

        if (normalizedIsActive.error) {
            return {
                error: normalizedIsActive.error,
            };
        }

        values.is_active = normalizedIsActive.value;
    }

    if (partial && Object.keys(values).length === 0) {
        return {
            error: "No valid stream link fields provided",
        };
    }

    return {
        values,
    };
};

const getPublicMatchStreams = async (req, res) => {
    try {
        const apiFixtureId = getPositiveIntegerParam(req.params.matchId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await getPublicStreamLinksByApiFixtureIdService(apiFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
                streamLinks: [],
            });
        }

        return res.status(200).json({
            message: result.message,
            source: "database_only",
            count: result.streamLinks.length,
            streamLinks: result.streamLinks,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load stream links",
            error: error.message,
        });
    }
};

const getAdminMatchStreams = async (req, res) => {
    try {
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await getAdminStreamLinksByApiFixtureIdService(apiFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
                streamLinks: [],
            });
        }

        return res.status(200).json({
            message: result.message,
            count: result.streamLinks.length,
            streamLinks: result.streamLinks,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load admin stream links",
            error: error.message,
        });
    }
};

const addStreamLink = async (req, res) => {
    try {
        const adminUserId = req.user.id;
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const normalizedBody = normalizeStreamLinkBody(req.body);

        if (normalizedBody.error) {
            return res.status(400).json({
                message: normalizedBody.error,
            });
        }

        const result = await addStreamLinkService(adminUserId, apiFixtureId, normalizedBody.values);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(result.created ? 201 : 200).json({
            message: result.created ? "Stream link added successfully" : "Stream link updated successfully",
            streamLink: result.streamLink,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to add stream link",
            error: error.message,
        });
    }
};

const updateStreamLink = async (req, res) => {
    try {
        const streamLinkId = getPositiveIntegerParam(req.params.streamLinkId);

        if (!streamLinkId) {
            return res.status(400).json({
                message: "Invalid stream link id",
            });
        }

        const normalizedBody = normalizeStreamLinkBody(req.body, {
            partial: true,
        });

        if (normalizedBody.error) {
            return res.status(400).json({
                message: normalizedBody.error,
            });
        }

        const result = await updateStreamLinkService(streamLinkId, normalizedBody.values);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: "Stream link updated successfully",
            streamLink: result.streamLink,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update stream link",
            error: error.message,
        });
    }
};

const deleteStreamLink = async (req, res) => {
    try {
        const streamLinkId = getPositiveIntegerParam(req.params.streamLinkId);

        if (!streamLinkId) {
            return res.status(400).json({
                message: "Invalid stream link id",
            });
        }

        const result = await deleteStreamLinkService(streamLinkId);

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
            message: "Failed to delete stream link",
            error: error.message,
        });
    }
};

export {
    addStreamLink,
    deleteStreamLink,
    getAdminMatchStreams,
    getPublicMatchStreams,
    updateStreamLink,
};
