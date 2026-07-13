const supportedSyncSeasons = [2022, 2023, 2024];
const defaultSyncSeason = 2024;

const parsePositiveInteger = (value) => {
    const parsedValue = Number(value);

    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const isSupportedSyncSeason = (season) => supportedSyncSeasons.includes(season);

const getSeasonRangeMessage = () => {
    const firstSeason = supportedSyncSeasons[0];
    const lastSeason = supportedSyncSeasons[supportedSyncSeasons.length - 1];

    return `This API-FOOTBALL plan only supports seasons from ${firstSeason} to ${lastSeason}`;
};

const shouldSyncAllSeasons = (value) => {
    return ["1", "true", "yes", "all"].includes(String(value || "").toLowerCase());
};

const getRequestedSeasons = ({ seasonQuery, allSeasonsQuery, defaultToAll = false }) => {
    if (shouldSyncAllSeasons(allSeasonsQuery) || (!seasonQuery && defaultToAll)) {
        return {
            seasons: supportedSyncSeasons,
            error: null,
        };
    }

    if (!seasonQuery) {
        return {
            seasons: [defaultSyncSeason],
            error: null,
        };
    }

    const season = parsePositiveInteger(seasonQuery);

    if (!season) {
        return {
            seasons: [],
            error: "Invalid season. Use a positive year",
        };
    }

    if (!isSupportedSyncSeason(season)) {
        return {
            seasons: [],
            error: getSeasonRangeMessage(),
        };
    }

    return {
        seasons: [season],
        error: null,
    };
};

export {
    defaultSyncSeason,
    getRequestedSeasons,
    getSeasonRangeMessage,
    isSupportedSyncSeason,
    parsePositiveInteger,
    shouldSyncAllSeasons,
    supportedSyncSeasons,
};
