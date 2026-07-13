import { Op } from "sequelize";
import {
    Fixture,
    FixtureOdd,
    League,
    Notification,
    PinnedMatch,
    PredictionPick,
    Team,
} from "../models/index.js";
import { getCambodiaDateTimeFields } from "../utils/cambodiaTime.js";

const finishedStatusShortCodes = ["FT", "AET", "PEN", "CANC", "ABD", "PST"];

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

const notificationInclude = [
    {
        model: Fixture,
        as: "fixture",
        include: fixtureInclude,
    },
    {
        model: PredictionPick,
        as: "predictionPick",
        include: [
            {
                model: FixtureOdd,
                as: "odd",
            },
        ],
    },
];

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
    };
};

const formatPublicLeague = (league) => {
    if (!league) {
        return null;
    }

    return {
        api_league_id: league.api_league_id,
        name: league.name,
        logo: league.logo,
        country: league.country,
        season: league.season,
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
        match_date: fixtureData.match_date,
        status_short: fixtureData.status_short,
        status_long: fixtureData.status_long,
        elapsed: fixtureData.elapsed,
        home_goals: fixtureData.home_goals,
        away_goals: fixtureData.away_goals,
        league: formatPublicLeague(fixtureData.league),
        homeTeam: formatPublicTeam(fixtureData.homeTeam),
        awayTeam: formatPublicTeam(fixtureData.awayTeam),
        ...getCambodiaDateTimeFields(fixtureData.match_date),
    };
};

const getMatchTitle = (fixture) => {
    const homeTeam = fixture?.homeTeam?.name || "Home Team";
    const awayTeam = fixture?.awayTeam?.name || "Away Team";

    return `${homeTeam} vs ${awayTeam}`;
};

const formatNotification = (notification) => {
    const notificationData = typeof notification.toJSON === "function"
        ? notification.toJSON()
        : notification;

    return {
        notification_id: notificationData.id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        is_read: notificationData.is_read,
        metadata: notificationData.metadata || {},
        created_at: notificationData.created_at || notificationData.createdAt,
        updated_at: notificationData.updated_at || notificationData.updatedAt,
        match: formatPublicFixture(notificationData.fixture),
    };
};

const createNotificationIfMissing = async (values) => {
    await Notification.findOrCreate({
        where: {
            user_id: values.user_id,
            reference_key: values.reference_key,
        },
        defaults: values,
    });
};

const syncPinnedMatchStartNotifications = async (userId) => {
    const now = new Date();
    const startWindow = new Date(now.getTime() - (12 * 60 * 60 * 1000));

    const pinnedMatches = await PinnedMatch.findAll({
        where: {
            user_id: userId,
        },
        include: [
            {
                model: Fixture,
                as: "fixture",
                required: true,
                where: {
                    match_date: {
                        [Op.lte]: now,
                        [Op.gte]: startWindow,
                    },
                    [Op.or]: [
                        {
                            status_short: {
                                [Op.notIn]: finishedStatusShortCodes,
                            },
                        },
                        {
                            status_short: null,
                        },
                    ],
                },
                include: fixtureInclude,
            },
        ],
    });

    await Promise.all(pinnedMatches.map((pinnedMatch) => {
        const fixture = pinnedMatch.fixture;
        const matchTitle = getMatchTitle(fixture);
        const dateFields = getCambodiaDateTimeFields(fixture.match_date);

        return createNotificationIfMissing({
            user_id: userId,
            fixture_id: fixture.id,
            type: "PINNED_MATCH_START",
            reference_key: `pinned-match-start:${fixture.id}`,
            title: "Pinned match starting",
            message: `${matchTitle} starts at ${dateFields.match_time_local || "kickoff time"}.`,
            metadata: {
                api_fixture_id: fixture.api_fixture_id,
                match_title: matchTitle,
                match_date_local: dateFields.match_date_local,
                match_time_local: dateFields.match_time_local,
            },
        });
    }));
};

const syncPredictionResultNotifications = async (userId) => {
    const predictionPicks = await PredictionPick.findAll({
        where: {
            user_id: userId,
            points_awarded: {
                [Op.not]: null,
            },
        },
        include: [
            {
                model: Fixture,
                as: "fixture",
                include: fixtureInclude,
            },
            {
                model: FixtureOdd,
                as: "odd",
            },
        ],
    });

    await Promise.all(predictionPicks.map((predictionPick) => {
        const pointsAwarded = Number(predictionPick.points_awarded || 0);
        const won = pointsAwarded > 0;
        const matchTitle = getMatchTitle(predictionPick.fixture);
        const pointText = `${pointsAwarded > 0 ? "+" : ""}${pointsAwarded.toFixed(2)}`;

        return createNotificationIfMissing({
            user_id: userId,
            fixture_id: predictionPick.fixture_id,
            prediction_pick_id: predictionPick.id,
            type: "PREDICTION_RESULT",
            reference_key: `prediction-result:${predictionPick.id}`,
            title: won ? "Prediction won" : "Prediction lost",
            message: `${matchTitle}: ${predictionPick.selection_label} ${won ? "won" : "lost"} ${pointText} points.`,
            metadata: {
                api_fixture_id: predictionPick.fixture?.api_fixture_id,
                match_title: matchTitle,
                selection_label: predictionPick.selection_label,
                points_awarded: pointsAwarded,
            },
        });
    }));
};

const syncUserNotifications = async (userId) => {
    await syncPinnedMatchStartNotifications(userId);
    await syncPredictionResultNotifications(userId);
};

const getMyNotificationsService = async (userId) => {
    await syncUserNotifications(userId);

    const notifications = await Notification.findAll({
        where: {
            user_id: userId,
        },
        include: notificationInclude,
        order: [["created_at", "DESC"]],
        limit: 50,
    });

    const unreadCount = await Notification.count({
        where: {
            user_id: userId,
            is_read: false,
        },
    });

    return {
        notifications: notifications.map(formatNotification),
        unreadCount,
    };
};

const markNotificationReadService = async (userId, notificationId) => {
    const notification = await Notification.findOne({
        where: {
            id: notificationId,
            user_id: userId,
        },
    });

    if (!notification) {
        return {
            status: "not_found",
            message: "Notification not found",
        };
    }

    await notification.update({
        is_read: true,
    });

    return {
        status: "success",
        message: "Notification marked as read",
    };
};

const markAllNotificationsReadService = async (userId) => {
    await Notification.update(
        {
            is_read: true,
        },
        {
            where: {
                user_id: userId,
                is_read: false,
            },
        },
    );

    return {
        status: "success",
        message: "All notifications marked as read",
    };
};

export {
    getMyNotificationsService,
    markAllNotificationsReadService,
    markNotificationReadService,
};
