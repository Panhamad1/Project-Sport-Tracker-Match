import { Op } from "sequelize";
import { Fixture, MatchDetail, Team } from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";
import { getCambodiaDateRange } from "../utils/cambodiaTime.js";

const isValidDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const safeApiFootballGet = async (section, endpoint, params) => {
    try {
        const apiData = await apiFootballGet(endpoint, params);

        return {
            section,
            status: "success",
            data: apiData.response || [],
            error_message: null,
        };
    } catch (error) {
        return {
            section,
            status: "failed",
            data: null,
            error_message: error.message,
        };
    }
};

const syncMatchDetailsById = async (matchId) => {
    const fixture = await Fixture.findByPk(matchId, {
        include: [
            {
                model: Team,
                as: "homeTeam",
            },
            {
                model: Team,
                as: "awayTeam",
            },
        ],
    });

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found",
        };
    }

    const existingDetail = await MatchDetail.findOne({
        where: {
            fixture_id: fixture.id,
        },
    });

    const h2hTeams = `${fixture.homeTeam.api_team_id}-${fixture.awayTeam.api_team_id}`;

    const statisticsResult = await safeApiFootballGet("statistics", "/fixtures/statistics", {
        fixture: fixture.api_fixture_id,
    });
    const lineupsResult = await safeApiFootballGet("lineups", "/fixtures/lineups", {
        fixture: fixture.api_fixture_id,
    });
    const predictionResult = await safeApiFootballGet("prediction", "/predictions", {
        fixture: fixture.api_fixture_id,
    });
    const eventsResult = await safeApiFootballGet("events", "/fixtures/events", {
        fixture: fixture.api_fixture_id,
    });
    const h2hResult = await safeApiFootballGet("h2h", "/fixtures/headtohead", {
        h2h: h2hTeams,
    });
    const existingRawData = existingDetail?.raw_data || {};

    const values = {
        fixture_id: fixture.id,
        statistics: statisticsResult.status === "success" ? statisticsResult.data : existingDetail?.statistics || [],
        lineups: lineupsResult.status === "success" ? lineupsResult.data : existingDetail?.lineups || [],
        prediction: predictionResult.status === "success" ? predictionResult.data : existingDetail?.prediction || null,
        h2h: h2hResult.status === "success" ? h2hResult.data : existingDetail?.h2h || [],
        streams: existingDetail?.streams || [],
        raw_data: {
            statistics: statisticsResult,
            lineups: lineupsResult,
            prediction: predictionResult,
            events: eventsResult.status === "success" ? eventsResult : existingRawData.events || eventsResult,
            h2h: h2hResult,
        },
        last_synced_at: new Date(),
    };

    const [matchDetail, created] = await MatchDetail.findOrCreate({
        where: {
            fixture_id: fixture.id,
        },
        defaults: values,
    });

    if (!created) {
        await matchDetail.update(values);
    }

    return {
        status: "success",
        fixture_id: fixture.id,
        api_fixture_id: fixture.api_fixture_id,
        sections: {
            statistics: statisticsResult.status,
            lineups: lineupsResult.status,
            prediction: predictionResult.status,
            events: eventsResult.status,
            h2h: h2hResult.status,
        },
        errors: {
            statistics: statisticsResult.error_message,
            lineups: lineupsResult.error_message,
            prediction: predictionResult.error_message,
            events: eventsResult.error_message,
            h2h: h2hResult.error_message,
        },
        detail: matchDetail,
    };
};

const getFixtureLabel = (fixture) => {
    const homeTeam = fixture.homeTeam?.name || "Unknown Team";
    const awayTeam = fixture.awayTeam?.name || "Unknown Team";

    return `${homeTeam} vs ${awayTeam}`;
};

const getSectionErrorMessage = (errors) => {
    const failedSections = Object.entries(errors || {})
        .filter(([, errorMessage]) => Boolean(errorMessage))
        .map(([section]) => section);

    return failedSections.length > 0
        ? `Some sections failed: ${failedSections.join(", ")}`
        : null;
};

const syncMatchDetailsByDate = async (date) => {
    if(!isValidDate(date)){
        throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    const { startDate, endDate } = getCambodiaDateRange(date);
    const fixtures = await Fixture.findAll({
        where: {
            match_date: {
                [Op.between]: [startDate, endDate],
            },
        },
        include: [
            {
                model: Team,
                as: "homeTeam",
            },
            {
                model: Team,
                as: "awayTeam",
            },
        ],
        order: [["match_date", "ASC"]],
    });
    const results = [];

    for (const fixture of fixtures) {
        try{
            const result = await syncMatchDetailsById(fixture.id);
            const errorMessage = getSectionErrorMessage(result.errors);

            results.push({
                matchId: fixture.id,
                api_fixture_id: fixture.api_fixture_id,
                match: getFixtureLabel(fixture),
                status: errorMessage ? "partial" : "success",
                message: errorMessage || "Match details synced successfully",
                error_message: errorMessage,
                sections: result.sections,
                errors: result.errors,
            });
        }catch(error){
            results.push({
                matchId: fixture.id,
                api_fixture_id: fixture.api_fixture_id,
                match: getFixtureLabel(fixture),
                status: "failed",
                message: "Failed to sync match details",
                error_message: error.message,
                sections: null,
                errors: {
                    request: error.message,
                },
            });
        }
    }

    const successCount = results.filter((item) => item.status === "success").length;
    const partialCount = results.filter((item) => item.status === "partial").length;
    const failedCount = results.filter((item) => item.status === "failed").length;

    return {
        status: "success",
        date,
        count: fixtures.length,
        success_count: successCount,
        partial_count: partialCount,
        failed_count: failedCount,
        results,
    };
};

export { syncMatchDetailsByDate, syncMatchDetailsById };
