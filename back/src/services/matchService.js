import { Fixture, League, MatchDetail, Team } from "../models/index.js";
import { getCambodiaDateTimeFields } from "../utils/cambodiaTime.js";

const buildMatchDetailsResponse = (match) => {
    const matchData = match.toJSON();
    const savedDetail = matchData.detail || {};

    return {
        overview: {
            id: matchData.id,
            api_fixture_id: matchData.api_fixture_id,
            match_date: matchData.match_date,
            ...getCambodiaDateTimeFields(matchData.match_date),
            status_long: matchData.status_long,
            status_short: matchData.status_short,
            elapsed: matchData.elapsed,
            home_goals: matchData.home_goals,
            away_goals: matchData.away_goals,
            venue_name: matchData.venue_name,
            venue_city: matchData.venue_city,
            league: matchData.league,
            homeTeam: matchData.homeTeam,
            awayTeam: matchData.awayTeam,
            score: matchData.raw_data?.score || null,
            last_updated: matchData.last_updated,
        },
        h2h: savedDetail.h2h || [],
        prediction: savedDetail.prediction || null,
        lineups: savedDetail.lineups || [],
        statistics: savedDetail.statistics || [],
        streams: savedDetail.streams || [],
        last_synced_at: savedDetail.last_synced_at || null,
    };
};

const getMatchByIdFromDatabaseOnly = async (matchId) => {
    const match = await Fixture.findByPk(matchId, {
        include: [
            {
                model: League,
                as: "league",
            },
            {
                model: Team,
                as: "homeTeam",
            },
            {
                model: Team,
                as: "awayTeam",
            },
            {
                model: MatchDetail,
                as: "detail",
            },
        ],
    });

    const details = match ? buildMatchDetailsResponse(match) : null;

    return {
        source: "database_only",
        match,
        details,
        apiRequestUsed: false,
    };
};

export { getMatchByIdFromDatabaseOnly };
