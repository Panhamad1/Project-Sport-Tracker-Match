import { Fixture, MatchDetail, Team } from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";

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
    const h2hResult = await safeApiFootballGet("h2h", "/fixtures/headtohead", {
        h2h: h2hTeams,
    });

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
            h2h: h2hResult.status,
        },
        errors: {
            statistics: statisticsResult.error_message,
            lineups: lineupsResult.error_message,
            prediction: predictionResult.error_message,
            h2h: h2hResult.error_message,
        },
        detail: matchDetail,
    };
};

export { syncMatchDetailsById };
