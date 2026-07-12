import {
    Fixture,
    League,
    PinnedMatch,
    Team,
} from "../models/index.js";
import { getCambodiaDateTimeFields } from "../utils/cambodiaTime.js";

const fixtureInclude = [
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
];

const formatPublicLeague = (league) => {
    if (!league) {
        return null;
    }

    return {
        api_league_id: league.api_league_id,
        name: league.name,
        type: league.type,
        logo: league.logo,
        country: league.country,
        season: league.season,
    };
};

const formatPublicTeam = (team) => {
    if (!team) {
        return null;
    }

    return {
        api_team_id: team.api_team_id,
        name: team.name,
        code: team.code,
        country: team.country,
        logo: team.logo,
        venue_name: team.venue_name,
        venue_city: team.venue_city,
    };
};

const formatPublicFixture = (fixture) => {
    if (!fixture) {
        return null;
    }

    const fixtureData = typeof fixture.toJSON === "function" ? fixture.toJSON() : fixture;

    return {
        public_match_id: fixtureData.api_fixture_id,
        api_fixture_id: fixtureData.api_fixture_id,
        season: fixtureData.season,
        match_date: fixtureData.match_date,
        status_long: fixtureData.status_long,
        status_short: fixtureData.status_short,
        elapsed: fixtureData.elapsed,
        home_goals: fixtureData.home_goals,
        away_goals: fixtureData.away_goals,
        venue_name: fixtureData.venue_name,
        venue_city: fixtureData.venue_city,
        league: formatPublicLeague(fixtureData.league),
        homeTeam: formatPublicTeam(fixtureData.homeTeam),
        awayTeam: formatPublicTeam(fixtureData.awayTeam),
        last_updated: fixtureData.last_updated,
        ...getCambodiaDateTimeFields(fixtureData.match_date),
    };
};

const formatPinnedMatch = (pinnedMatch) => {
    const pinnedMatchData = typeof pinnedMatch.toJSON === "function"
        ? pinnedMatch.toJSON()
        : pinnedMatch;

    return {
        pinned_at: pinnedMatchData.created_at || pinnedMatchData.createdAt,
        match: formatPublicFixture(pinnedMatchData.fixture),
    };
};

const findFixtureByApiFixtureId = async (apiFixtureId) => {
    return Fixture.findOne({
        where: {
            api_fixture_id: apiFixtureId,
        },
        include: fixtureInclude,
    });
};

const addPinnedMatchService = async (userId, apiFixtureId) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
        };
    }

    const [pinnedMatch, created] = await PinnedMatch.findOrCreate({
        where: {
            user_id: userId,
            fixture_id: fixture.id,
        },
        defaults: {
            user_id: userId,
            fixture_id: fixture.id,
        },
    });

    return {
        status: "success",
        created,
        pinnedMatch: formatPinnedMatch({
            ...pinnedMatch.toJSON(),
            fixture,
        }),
    };
};

const getMyPinnedMatchesService = async (userId) => {
    const pinnedMatches = await PinnedMatch.findAll({
        where: {
            user_id: userId,
        },
        include: [
            {
                model: Fixture,
                as: "fixture",
                include: fixtureInclude,
            },
        ],
        order: [["created_at", "DESC"]],
    });

    return pinnedMatches.map(formatPinnedMatch);
};

const removePinnedMatchService = async (userId, apiFixtureId) => {
    const fixture = await Fixture.findOne({
        where: {
            api_fixture_id: apiFixtureId,
        },
    });

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
            deletedCount: 0,
        };
    }

    const deletedCount = await PinnedMatch.destroy({
        where: {
            user_id: userId,
            fixture_id: fixture.id,
        },
    });

    return {
        status: deletedCount === 0 ? "not_found" : "success",
        message: deletedCount === 0 ? "Pinned match not found" : "Pinned match removed successfully",
        deletedCount,
    };
};

export {
    addPinnedMatchService,
    getMyPinnedMatchesService,
    removePinnedMatchService,
};
