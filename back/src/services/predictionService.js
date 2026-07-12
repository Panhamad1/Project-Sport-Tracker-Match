import { Op } from "sequelize";
import {
    Fixture,
    FixtureOdd,
    League,
    PredictionPick,
    Team,
    User,
    sequelize,
} from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";
import { getCambodiaDateTimeFields } from "../utils/cambodiaTime.js";

const finishedStatusShortCodes = ["FT", "AET", "PEN"];
const allowedOverUnderLines = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];

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

const predictionPickInclude = [
    {
        model: Fixture,
        as: "fixture",
        include: fixtureInclude,
    },
    {
        model: FixtureOdd,
        as: "odd",
    },
];

const toNumberOrNull = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
};

const toMoneyNumber = (value) => {
    const numberValue = toNumberOrNull(value);

    return numberValue === null ? null : Number(numberValue.toFixed(2));
};

const formatLineKey = (line) => {
    return String(line).replace(".", "_");
};

const isAllowedOverUnderLine = (line) => {
    const lineValue = Number(line);

    return allowedOverUnderLines.includes(lineValue);
};

const normalizeText = (value) => {
    return String(value || "").trim().toLowerCase();
};

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

const formatFixtureOdd = (fixtureOdd) => {
    const oddData = typeof fixtureOdd.toJSON === "function" ? fixtureOdd.toJSON() : fixtureOdd;

    return {
        fixture_odd_id: oddData.id,
        market_type: oddData.market_type,
        prediction_key: oddData.prediction_key,
        selection_key: oddData.selection_key,
        selection_label: oddData.selection_label,
        line: toNumberOrNull(oddData.line),
        odd: toMoneyNumber(oddData.odd),
        points: toMoneyNumber(oddData.odd),
        implied_probability: toNumberOrNull(oddData.implied_probability),
        bookmaker_id: oddData.bookmaker_id,
        bookmaker_name: oddData.bookmaker_name,
        last_synced_at: oddData.last_synced_at,
    };
};

const formatPredictionPick = (predictionPick) => {
    const pickData = typeof predictionPick.toJSON === "function"
        ? predictionPick.toJSON()
        : predictionPick;

    return {
        prediction_pick_id: pickData.id,
        fixture_odd_id: pickData.fixture_odd_id,
        market_type: pickData.market_type,
        prediction_key: pickData.prediction_key,
        selection_key: pickData.selection_key,
        selection_label: pickData.selection_label,
        line: toNumberOrNull(pickData.line),
        odd_snapshot: toMoneyNumber(pickData.odd_snapshot),
        potential_points: toMoneyNumber(pickData.potential_points),
        points_awarded: toMoneyNumber(pickData.points_awarded),
        awarded_at: pickData.awarded_at,
        created_at: pickData.created_at || pickData.createdAt,
        updated_at: pickData.updated_at || pickData.updatedAt,
        match: formatPublicFixture(pickData.fixture),
    };
};

const groupFixtureOdds = (fixtureOdds) => {
    const odds = fixtureOdds.map(formatFixtureOdd);
    const winner = odds
        .filter((odd) => odd.market_type === "WINNER")
        .sort((a, b) => ["HOME", "DRAW", "AWAY"].indexOf(a.selection_key) - ["HOME", "DRAW", "AWAY"].indexOf(b.selection_key));
    const overUnderGroups = new Map();

    odds
        .filter((odd) => odd.market_type === "OVER_UNDER")
        .sort((a, b) => (a.line || 0) - (b.line || 0))
        .forEach((odd) => {
            const key = String(odd.line);

            if (!overUnderGroups.has(key)) {
                overUnderGroups.set(key, {
                    line: odd.line,
                    prediction_key: odd.prediction_key,
                    options: [],
                });
            }

            overUnderGroups.get(key).options.push(odd);
        });

    return {
        winner,
        over_under: [...overUnderGroups.values()].map((group) => ({
            ...group,
            options: group.options.sort((a, b) => a.selection_key.localeCompare(b.selection_key)),
        })),
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

const isPredictionLocked = (fixture) => {
    const statusShort = String(fixture.status_short || "").toUpperCase();
    const matchDate = new Date(fixture.match_date);

    if (statusShort && statusShort !== "NS") {
        return true;
    }

    if (!Number.isNaN(matchDate.getTime()) && new Date() >= matchDate) {
        return true;
    }

    return false;
};

const isMatchFinished = (fixture) => {
    const statusShort = String(fixture.status_short || "").toUpperCase();

    return finishedStatusShortCodes.includes(statusShort);
};

const getWinnerSelectionKey = (homeGoals, awayGoals) => {
    if (homeGoals > awayGoals) {
        return "HOME";
    }

    if (awayGoals > homeGoals) {
        return "AWAY";
    }

    return "DRAW";
};

const isPickCorrect = (predictionPick, fixture) => {
    const pickData = typeof predictionPick.toJSON === "function"
        ? predictionPick.toJSON()
        : predictionPick;

    if (pickData.market_type === "WINNER") {
        return pickData.selection_key === getWinnerSelectionKey(fixture.home_goals, fixture.away_goals);
    }

    if (pickData.market_type === "OVER_UNDER") {
        const line = toNumberOrNull(pickData.line);

        if (line === null) {
            return false;
        }

        const totalGoals = Number(fixture.home_goals) + Number(fixture.away_goals);

        if (pickData.selection_key.startsWith("OVER_")) {
            return totalGoals > line;
        }

        if (pickData.selection_key.startsWith("UNDER_")) {
            return totalGoals < line;
        }
    }

    return false;
};

const parseOddValue = (value) => {
    const numberValue = Number.parseFloat(String(value || "").replace(",", "."));

    return Number.isFinite(numberValue) && numberValue > 0 ? Number(numberValue.toFixed(2)) : null;
};

const parseOverUnderValue = (value) => {
    const match = String(value || "").match(/^(over|under)\s+([0-9]+(?:[.,][0-9]+)?)/i);

    if (!match) {
        return null;
    }

    const side = match[1].toUpperCase();
    const line = Number.parseFloat(match[2].replace(",", "."));

    if (!Number.isFinite(line)) {
        return null;
    }

    const lineValue = Number(line.toFixed(2));

    if (!isAllowedOverUnderLine(lineValue)) {
        return null;
    }

    const lineKey = formatLineKey(lineValue);

    return {
        market_type: "OVER_UNDER",
        prediction_key: `OVER_UNDER_${lineKey}`,
        selection_key: `${side}_${lineKey}`,
        selection_label: `${side === "OVER" ? "Over" : "Under"} ${lineValue}`,
        line: lineValue,
    };
};

const parseWinnerValue = (value) => {
    const normalizedValue = normalizeText(value);
    const winnerMap = {
        home: "HOME",
        "1": "HOME",
        draw: "DRAW",
        x: "DRAW",
        away: "AWAY",
        "2": "AWAY",
    };
    const selectionKey = winnerMap[normalizedValue];

    if (!selectionKey) {
        return null;
    }

    const labels = {
        HOME: "Home",
        DRAW: "Draw",
        AWAY: "Away",
    };

    return {
        market_type: "WINNER",
        prediction_key: "WINNER",
        selection_key: selectionKey,
        selection_label: labels[selectionKey],
        line: null,
    };
};

const isWinnerBet = (bet) => {
    const betName = normalizeText(bet.name);

    return Number(bet.id) === 1
        || betName === "1x2"
        || betName.includes("match winner");
};

const isOverUnderBet = (bet) => {
    const betName = normalizeText(bet.name);

    return Number(bet.id) === 5
        || betName.includes("goals over/under")
        || betName.includes("over/under");
};

const collectOddsFromApiResponse = (responseItems) => {
    const oddsBySelection = new Map();

    responseItems.forEach((responseItem) => {
        (responseItem.bookmakers || []).forEach((bookmaker) => {
            (bookmaker.bets || []).forEach((bet) => {
                const valueParser = isWinnerBet(bet)
                    ? parseWinnerValue
                    : isOverUnderBet(bet)
                        ? parseOverUnderValue
                        : null;

                if (!valueParser) {
                    return;
                }

                (bet.values || []).forEach((valueItem) => {
                    const parsedValue = valueParser(valueItem.value);
                    const odd = parseOddValue(valueItem.odd);

                    if (!parsedValue || odd === null) {
                        return;
                    }

                    const selectionMapKey = `${parsedValue.market_type}:${parsedValue.selection_key}`;

                    if (oddsBySelection.has(selectionMapKey)) {
                        return;
                    }

                    oddsBySelection.set(selectionMapKey, {
                        ...parsedValue,
                        odd,
                        implied_probability: Number((1 / odd).toFixed(6)),
                        bookmaker_id: bookmaker.id || null,
                        bookmaker_name: bookmaker.name || null,
                        raw_data: {
                            fixture: responseItem.fixture,
                            league: responseItem.league,
                            update: responseItem.update,
                            bookmaker,
                            bet,
                            value: valueItem,
                        },
                    });
                });
            });
        });
    });

    return [...oddsBySelection.values()];
};

const fetchFixtureOddsFromApi = async (apiFixtureId, bookmaker) => {
    const responseItems = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
        const params = {
            fixture: apiFixtureId,
            page: currentPage,
        };

        if (bookmaker) {
            params.bookmaker = bookmaker;
        }

        const data = await apiFootballGet("/odds", params);
        responseItems.push(...(data.response || []));
        totalPages = Number(data.paging?.total || 1);
        currentPage += 1;
    } while (currentPage <= totalPages);

    return responseItems;
};

const syncFixtureOddsService = async (apiFixtureId, options = {}) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
        };
    }

    const responseItems = await fetchFixtureOddsFromApi(apiFixtureId, options.bookmaker);
    const odds = collectOddsFromApiResponse(responseItems);
    const syncedAt = new Date();
    const savedOdds = [];

    for (const odd of odds) {
        const values = {
            fixture_id: fixture.id,
            market_type: odd.market_type,
            prediction_key: odd.prediction_key,
            selection_key: odd.selection_key,
            selection_label: odd.selection_label,
            line: odd.line,
            odd: odd.odd,
            implied_probability: odd.implied_probability,
            bookmaker_id: odd.bookmaker_id,
            bookmaker_name: odd.bookmaker_name,
            raw_data: odd.raw_data,
            last_synced_at: syncedAt,
        };

        const [fixtureOdd, created] = await FixtureOdd.findOrCreate({
            where: {
                fixture_id: fixture.id,
                market_type: odd.market_type,
                selection_key: odd.selection_key,
            },
            defaults: values,
        });

        if (!created) {
            await fixtureOdd.update(values);
        }

        savedOdds.push({
            ...fixtureOdd.toJSON(),
            ...values,
            id: fixtureOdd.id,
        });
    }

    return {
        status: "success",
        message: savedOdds.length === 0
            ? "No supported odds returned by API-FOOTBALL for this match"
            : "Prediction odds synced successfully",
        match: formatPublicFixture(fixture),
        count: savedOdds.length,
        odds: groupFixtureOdds(savedOdds),
        raw_count: responseItems.length,
    };
};

const getFixtureOddsForMatch = async (fixtureId) => {
    return FixtureOdd.findAll({
        where: {
            fixture_id: fixtureId,
            [Op.or]: [
                {
                    market_type: "WINNER",
                },
                {
                    market_type: "OVER_UNDER",
                    line: {
                        [Op.in]: allowedOverUnderLines,
                    },
                },
            ],
        },
        order: [
            ["market_type", "ASC"],
            ["line", "ASC"],
            ["selection_key", "ASC"],
        ],
    });
};

const getPredictionPicksForMatch = async (userId, fixtureId) => {
    return PredictionPick.findAll({
        where: {
            user_id: userId,
            fixture_id: fixtureId,
        },
        include: predictionPickInclude,
        order: [["created_at", "DESC"]],
    });
};

const getMatchPredictionOptionsService = async (userId, apiFixtureId) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
        };
    }

    const [fixtureOdds, predictionPicks] = await Promise.all([
        getFixtureOddsForMatch(fixture.id),
        getPredictionPicksForMatch(userId, fixture.id),
    ]);

    return {
        status: "success",
        message: fixtureOdds.length === 0 ? "No odds synced for this match yet" : "Prediction options loaded successfully",
        source: "database_only",
        match: formatPublicFixture(fixture),
        is_locked: isPredictionLocked(fixture),
        odds: groupFixtureOdds(fixtureOdds),
        my_picks: predictionPicks.map(formatPredictionPick),
    };
};

const savePredictionPickService = async (userId, apiFixtureId, fixtureOddId) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
        };
    }

    if (isPredictionLocked(fixture)) {
        return {
            status: "locked",
            message: "Prediction is locked because the match already started",
            match: formatPublicFixture(fixture),
        };
    }

    const fixtureOdd = await FixtureOdd.findOne({
        where: {
            id: fixtureOddId,
            fixture_id: fixture.id,
            [Op.or]: [
                {
                    market_type: "WINNER",
                },
                {
                    market_type: "OVER_UNDER",
                    line: {
                        [Op.in]: allowedOverUnderLines,
                    },
                },
            ],
        },
    });

    if (!fixtureOdd) {
        return {
            status: "not_found",
            message: "Prediction odd not found for this match",
        };
    }

    const oddSnapshot = toMoneyNumber(fixtureOdd.odd);
    const values = {
        user_id: userId,
        fixture_id: fixture.id,
        fixture_odd_id: fixtureOdd.id,
        market_type: fixtureOdd.market_type,
        prediction_key: fixtureOdd.prediction_key,
        selection_key: fixtureOdd.selection_key,
        selection_label: fixtureOdd.selection_label,
        line: fixtureOdd.line,
        odd_snapshot: oddSnapshot,
        potential_points: oddSnapshot,
    };

    const [predictionPick, created] = await PredictionPick.findOrCreate({
        where: {
            user_id: userId,
            fixture_id: fixture.id,
            prediction_key: fixtureOdd.prediction_key,
        },
        defaults: values,
    });

    if (!created) {
        if (predictionPick.points_awarded !== null) {
            return {
                status: "awarded",
                message: "Prediction pick already awarded and cannot be changed",
            };
        }

        await predictionPick.update(values);
    }

    const savedPredictionPick = await PredictionPick.findByPk(predictionPick.id, {
        include: predictionPickInclude,
    });

    return {
        status: "success",
        created,
        predictionPick: formatPredictionPick(savedPredictionPick),
    };
};

const getMyPredictionsService = async (userId) => {
    const predictionPicks = await PredictionPick.findAll({
        where: {
            user_id: userId,
        },
        include: predictionPickInclude,
        order: [["created_at", "DESC"]],
    });

    return predictionPicks.map(formatPredictionPick);
};

const getMyPredictionForMatchService = async (userId, apiFixtureId) => {
    return getMatchPredictionOptionsService(userId, apiFixtureId);
};

const deletePredictionPickService = async (userId, predictionPickId) => {
    const predictionPick = await PredictionPick.findOne({
        where: {
            id: predictionPickId,
            user_id: userId,
        },
        include: predictionPickInclude,
    });

    if (!predictionPick) {
        return {
            status: "not_found",
            message: "Prediction pick not found",
        };
    }

    if (isPredictionLocked(predictionPick.fixture)) {
        return {
            status: "locked",
            message: "Prediction is locked because the match already started",
        };
    }

    if (predictionPick.points_awarded !== null) {
        return {
            status: "awarded",
            message: "Prediction pick already awarded and cannot be deleted",
        };
    }

    await predictionPick.destroy();

    return {
        status: "success",
        message: "Prediction pick deleted successfully",
    };
};

const deletePredictionService = async (userId, apiFixtureId) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
        };
    }

    if (isPredictionLocked(fixture)) {
        return {
            status: "locked",
            message: "Prediction is locked because the match already started",
        };
    }

    const deletedCount = await PredictionPick.destroy({
        where: {
            user_id: userId,
            fixture_id: fixture.id,
            points_awarded: {
                [Op.is]: null,
            },
        },
    });

    return {
        status: deletedCount === 0 ? "not_found" : "success",
        message: deletedCount === 0 ? "No removable prediction picks found" : "Prediction picks deleted successfully",
        deletedCount,
    };
};

const awardPredictionPointsService = async (apiFixtureId) => {
    const fixture = await findFixtureByApiFixtureId(apiFixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Match not found in database",
        };
    }

    if (!isMatchFinished(fixture)) {
        return {
            status: "not_finished",
            message: "Match is not finished yet",
            match: formatPublicFixture(fixture),
        };
    }

    if (fixture.home_goals === null || fixture.away_goals === null) {
        return {
            status: "missing_score",
            message: "Match final score is missing",
            match: formatPublicFixture(fixture),
        };
    }

    const predictionPicks = await PredictionPick.findAll({
        where: {
            fixture_id: fixture.id,
        },
    });
    const unawardedPicks = predictionPicks.filter((predictionPick) => predictionPick.points_awarded === null);
    const awardedAt = new Date();

    const awardedPicks = await sequelize.transaction(async (transaction) => {
        const awarded = [];

        for (const predictionPick of unawardedPicks) {
            const correct = isPickCorrect(predictionPick, fixture);
            const oddSnapshot = toMoneyNumber(predictionPick.odd_snapshot);
            const points = correct ? oddSnapshot : -oddSnapshot;

            await predictionPick.update({
                points_awarded: points,
                awarded_at: awardedAt,
            }, {
                transaction,
            });

            await User.increment("points", {
                by: points,
                where: {
                    id: predictionPick.user_id,
                },
                transaction,
            });

            awarded.push({
                user_id: predictionPick.user_id,
                market_type: predictionPick.market_type,
                selection_key: predictionPick.selection_key,
                selection_label: predictionPick.selection_label,
                line: toNumberOrNull(predictionPick.line),
                odd_snapshot: oddSnapshot,
                correct,
                points_awarded: points,
            });
        }

        return awarded;
    });

    return {
        status: "success",
        message: "Prediction points awarded successfully",
        match: formatPublicFixture(fixture),
        total_picks: predictionPicks.length,
        newly_awarded: awardedPicks.length,
        skipped_already_awarded: predictionPicks.length - unawardedPicks.length,
        awardedPicks,
    };
};

export {
    awardPredictionPointsService,
    deletePredictionPickService,
    deletePredictionService,
    getMatchPredictionOptionsService,
    getMyPredictionForMatchService,
    getMyPredictionsService,
    savePredictionPickService,
    syncFixtureOddsService,
};
