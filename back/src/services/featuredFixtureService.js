import { Op } from "sequelize";
import {
    FeaturedFixture,
    Fixture,
    League,
    Team,
    User,
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

const featuredFixtureInclude = [
    {
        model: Fixture,
        as: "fixture",
        include: fixtureInclude,
    },
    {
        model: User,
        as: "selector",
        attributes: ["id", "username", "email"],
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

const formatPublicFeaturedFixture = (featuredFixture) => {
    const featuredFixtureData = typeof featuredFixture.toJSON === "function"
        ? featuredFixture.toJSON()
        : featuredFixture;

    return {
        featured_date: featuredFixtureData.featured_date,
        priority: featuredFixtureData.priority,
        label: featuredFixtureData.label,
        selected_at: featuredFixtureData.created_at || featuredFixtureData.createdAt,
        match: formatPublicFixture(featuredFixtureData.fixture),
    };
};

const formatAdminFeaturedFixture = (featuredFixture) => {
    const featuredFixtureData = typeof featuredFixture.toJSON === "function"
        ? featuredFixture.toJSON()
        : featuredFixture;

    return {
        id: featuredFixtureData.id,
        featured_fixture_id: featuredFixtureData.id,
        featured_date: featuredFixtureData.featured_date,
        priority: featuredFixtureData.priority,
        label: featuredFixtureData.label,
        selected_by: featuredFixtureData.selected_by,
        selected_by_user: featuredFixtureData.selector ? {
            id: featuredFixtureData.selector.id,
            username: featuredFixtureData.selector.username,
            email: featuredFixtureData.selector.email,
        } : null,
        selected_at: featuredFixtureData.created_at || featuredFixtureData.createdAt,
        updated_at: featuredFixtureData.updated_at || featuredFixtureData.updatedAt,
        match: formatPublicFixture(featuredFixtureData.fixture),
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

const findFeaturedFixtureById = async (featuredFixtureId) => {
    return FeaturedFixture.findByPk(featuredFixtureId, {
        include: featuredFixtureInclude,
    });
};

const getTopMatchService = async ({ admin = false } = {}) => {
    const topMatch = await FeaturedFixture.findOne({
        include: featuredFixtureInclude,
        order: [["updated_at", "DESC"], ["created_at", "DESC"]],
    });

    if (!topMatch) {
        return null;
    }

    return admin
        ? formatAdminFeaturedFixture(topMatch)
        : formatPublicFeaturedFixture(topMatch);
};

const addFeaturedFixtureService = async (adminUserId, apiFixtureId, featuredData) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
        };
    }

    const fixtureDate = getCambodiaDateTimeFields(fixture.match_date).match_date_local;
    const values = {
        fixture_id: fixture.id,
        featured_date: featuredData.featured_date || fixtureDate,
        priority: featuredData.priority || 1,
        label: featuredData.label || "Top Match",
        selected_by: adminUserId,
    };

    const currentTopMatch = await FeaturedFixture.findOne({
        order: [["updated_at", "DESC"], ["created_at", "DESC"]],
    });
    let featuredFixture = currentTopMatch;
    let created = false;

    if (currentTopMatch) {
        await currentTopMatch.update(values);
        await FeaturedFixture.destroy({
            where: {
                id: {
                    [Op.ne]: currentTopMatch.id,
                },
            },
        });
    } else {
        featuredFixture = await FeaturedFixture.create(values);
        created = true;
    }

    const savedFeaturedFixture = await findFeaturedFixtureById(featuredFixture.id);

    return {
        status: "success",
        created,
        featuredFixture: formatAdminFeaturedFixture(savedFeaturedFixture),
    };
};

const updateFeaturedFixtureService = async (featuredFixtureId, featuredData) => {
    const featuredFixture = await FeaturedFixture.findByPk(featuredFixtureId);

    if (!featuredFixture) {
        return {
            status: "not_found",
            message: "Top match not found",
        };
    }

    await featuredFixture.update(featuredData);
    await FeaturedFixture.destroy({
        where: {
            id: {
                [Op.ne]: featuredFixture.id,
            },
        },
    });

    const savedFeaturedFixture = await findFeaturedFixtureById(featuredFixture.id);

    return {
        status: "success",
        featuredFixture: formatAdminFeaturedFixture(savedFeaturedFixture),
    };
};

const deleteFeaturedFixtureService = async (featuredFixtureId) => {
    const deletedCount = await FeaturedFixture.destroy({
        where: {
            id: featuredFixtureId,
        },
    });

    return {
        status: deletedCount === 0 ? "not_found" : "success",
        message: deletedCount === 0 ? "Top match not found" : "Top match removed successfully",
        deletedCount,
    };
};

export {
    addFeaturedFixtureService,
    deleteFeaturedFixtureService,
    getTopMatchService,
    updateFeaturedFixtureService,
};
