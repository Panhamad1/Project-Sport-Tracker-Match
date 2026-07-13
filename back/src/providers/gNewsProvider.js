import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const BASE_URL = process.env.GNEWS_BASE_URL || "https://gnews.io/api/v4";

const gNewsClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
});

const formatGNewsErrors = (errors) => {
    if (!errors) {
        return "";
    }

    if (Array.isArray(errors)) {
        return errors.join(", ");
    }

    if (typeof errors === "object") {
        return Object.entries(errors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("; ");
    }

    return String(errors);
};

const getGNewsApiErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
        return error.message || "Failed to request GNews API";
    }

    if (typeof data === "string") {
        return data;
    }

    return formatGNewsErrors(data.errors) || data.message || data.error || "GNews API returned an error";
};

const gNewsGet = async (endpoint, params = {}) => {
    const apiKey = process.env.GNEWS_API_KEY || process.env.GNEWS_KEY;

    if (!apiKey) {
        const error = new Error("GNEWS_API_KEY is missing in backend environment variables");
        error.statusCode = 500;
        throw error;
    }

    try {
        const response = await gNewsClient.get(endpoint, {
            params: {
                ...params,
                apikey: apiKey,
            },
        });

        const data = response.data;
        const formattedErrors = formatGNewsErrors(data?.errors);

        if (formattedErrors) {
            const error = new Error(`GNews API error: ${formattedErrors}`);
            error.statusCode = 400;
            throw error;
        }

        return data;
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        const requestError = new Error(`Request GNews API Failed: ${getGNewsApiErrorMessage(error)}`);
        requestError.statusCode = error.response?.status || 500;
        throw requestError;
    }
};

const gNewsSearch = async (params = {}) => {
    return gNewsGet("/search", params);
};

export { gNewsGet, gNewsSearch };
