import {
    Fixture,
    League,
    StreamLink,
    Team,
    User,
} from "../models/index.js";

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

const formatPublicStreamLink = (streamLink) => {
    const streamLinkData = typeof streamLink.toJSON === "function"
        ? streamLink.toJSON()
        : streamLink;

    return {
        title: streamLinkData.title,
        url: streamLinkData.url,
        source_name: streamLinkData.source_name,
        is_active: streamLinkData.is_active,
        added_at: streamLinkData.created_at || streamLinkData.createdAt,
    };
};

const formatAdminStreamLink = (streamLink) => {
    const streamLinkData = typeof streamLink.toJSON === "function"
        ? streamLink.toJSON()
        : streamLink;

    return {
        id: streamLinkData.id,
        stream_link_id: streamLinkData.id,
        title: streamLinkData.title,
        url: streamLinkData.url,
        source_name: streamLinkData.source_name,
        is_active: streamLinkData.is_active,
        added_by: streamLinkData.added_by,
        added_by_user: streamLinkData.admin ? {
            id: streamLinkData.admin.id,
            username: streamLinkData.admin.username,
            email: streamLinkData.admin.email,
        } : null,
        public_match_id: streamLinkData.fixture?.api_fixture_id || null,
        api_fixture_id: streamLinkData.fixture?.api_fixture_id || null,
        fixture_summary: streamLinkData.fixture ? {
            league: streamLinkData.fixture.league?.name || null,
            home_team: streamLinkData.fixture.homeTeam?.name || null,
            away_team: streamLinkData.fixture.awayTeam?.name || null,
            match_date: streamLinkData.fixture.match_date || null,
        } : null,
        created_at: streamLinkData.created_at || streamLinkData.createdAt,
        updated_at: streamLinkData.updated_at || streamLinkData.updatedAt,
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

const getActiveStreamLinksByFixtureId = async (fixtureId) => {
    const streamLinks = await StreamLink.findAll({
        where: {
            fixture_id: fixtureId,
            is_active: true,
        },
        order: [["created_at", "DESC"]],
    });

    return streamLinks.map(formatPublicStreamLink);
};

const getPublicStreamLinksByApiFixtureIdService = async (apiFixtureId) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
            streamLinks: [],
        };
    }

    const streamLinks = await getActiveStreamLinksByFixtureId(fixture.id);

    return {
        status: "success",
        message: streamLinks.length === 0 ? "No stream links yet" : "Stream links loaded successfully",
        streamLinks,
    };
};

const getAdminStreamLinksByApiFixtureIdService = async (apiFixtureId) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
            streamLinks: [],
        };
    }

    const streamLinks = await StreamLink.findAll({
        where: {
            fixture_id: fixture.id,
        },
        include: [
            {
                model: Fixture,
                as: "fixture",
                include: fixtureInclude,
            },
            {
                model: User,
                as: "admin",
                attributes: ["id", "username", "email"],
            },
        ],
        order: [["created_at", "DESC"]],
    });

    return {
        status: "success",
        message: streamLinks.length === 0 ? "No stream links yet" : "Stream links loaded successfully",
        streamLinks: streamLinks.map(formatAdminStreamLink),
    };
};

const addStreamLinkService = async (adminUserId, apiFixtureId, streamLinkData) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
        };
    }

    const values = {
        fixture_id: fixture.id,
        title: streamLinkData.title,
        url: streamLinkData.url,
        source_name: streamLinkData.source_name || null,
        is_active: streamLinkData.is_active ?? true,
        added_by: adminUserId,
    };

    const [streamLink, created] = await StreamLink.findOrCreate({
        where: {
            fixture_id: fixture.id,
            url: streamLinkData.url,
        },
        defaults: values,
    });

    if (!created) {
        await streamLink.update(values);
    }

    const savedStreamLink = await StreamLink.findByPk(streamLink.id, {
        include: [
            {
                model: Fixture,
                as: "fixture",
                include: fixtureInclude,
            },
            {
                model: User,
                as: "admin",
                attributes: ["id", "username", "email"],
            },
        ],
    });

    return {
        status: "success",
        created,
        streamLink: formatAdminStreamLink(savedStreamLink),
    };
};

const updateStreamLinkService = async (streamLinkId, streamLinkData) => {
    const streamLink = await StreamLink.findByPk(streamLinkId);

    if (!streamLink) {
        return {
            status: "not_found",
            message: "Stream link not found",
        };
    }

    await streamLink.update(streamLinkData);

    const savedStreamLink = await StreamLink.findByPk(streamLink.id, {
        include: [
            {
                model: Fixture,
                as: "fixture",
                include: fixtureInclude,
            },
            {
                model: User,
                as: "admin",
                attributes: ["id", "username", "email"],
            },
        ],
    });

    return {
        status: "success",
        streamLink: formatAdminStreamLink(savedStreamLink),
    };
};

const deleteStreamLinkService = async (streamLinkId) => {
    const deletedCount = await StreamLink.destroy({
        where: {
            id: streamLinkId,
        },
    });

    return {
        status: deletedCount === 0 ? "not_found" : "success",
        message: deletedCount === 0 ? "Stream link not found" : "Stream link deleted successfully",
        deletedCount,
    };
};

export {
    addStreamLinkService,
    deleteStreamLinkService,
    getActiveStreamLinksByFixtureId,
    getAdminStreamLinksByApiFixtureIdService,
    getPublicStreamLinksByApiFixtureIdService,
    updateStreamLinkService,
};
