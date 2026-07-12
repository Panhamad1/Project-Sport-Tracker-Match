import { Op } from "sequelize";
import { PredictionPick, User, sequelize } from "../models/index.js";

const toInteger = (value) => {
    const numberValue = Number(value || 0);

    return Number.isFinite(numberValue) ? numberValue : 0;
};

const getDefaultStats = () => ({
    prediction_count: 0,
    pending_prediction_count: 0,
    settled_prediction_count: 0,
    correct_prediction_count: 0,
    wrong_prediction_count: 0,
    win_rate: 0,
});

const getPredictionStatsByUserId = async (userIds) => {
    if (userIds.length === 0) {
        return new Map();
    }

    const rows = await PredictionPick.findAll({
        where: {
            user_id: {
                [Op.in]: userIds,
            },
        },
        attributes: [
            "user_id",
            [sequelize.fn("COUNT", sequelize.col("id")), "prediction_count"],
            [sequelize.fn("SUM", sequelize.literal("CASE WHEN points_awarded IS NULL THEN 1 ELSE 0 END")), "pending_prediction_count"],
            [sequelize.fn("SUM", sequelize.literal("CASE WHEN points_awarded IS NOT NULL THEN 1 ELSE 0 END")), "settled_prediction_count"],
            [sequelize.fn("SUM", sequelize.literal("CASE WHEN points_awarded > 0 THEN 1 ELSE 0 END")), "correct_prediction_count"],
            [sequelize.fn("SUM", sequelize.literal("CASE WHEN points_awarded < 0 THEN 1 ELSE 0 END")), "wrong_prediction_count"],
        ],
        group: ["user_id"],
        raw: true,
    });

    return new Map(rows.map((row) => {
        const settledPredictionCount = toInteger(row.settled_prediction_count);
        const correctPredictionCount = toInteger(row.correct_prediction_count);
        const winRate = settledPredictionCount === 0
            ? 0
            : Number(((correctPredictionCount / settledPredictionCount) * 100).toFixed(2));

        return [
            Number(row.user_id),
            {
                prediction_count: toInteger(row.prediction_count),
                pending_prediction_count: toInteger(row.pending_prediction_count),
                settled_prediction_count: settledPredictionCount,
                correct_prediction_count: correctPredictionCount,
                wrong_prediction_count: toInteger(row.wrong_prediction_count),
                win_rate: winRate,
            },
        ];
    }));
};

const getLeaderboardService = async (limit = 50) => {
    const safeLimit = Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 50;

    const users = await User.findAll({
        where: {
            role: "user",
        },
        attributes: ["id", "username", "points"],
        order: [["points", "DESC"], ["created_at", "ASC"]],
        limit: safeLimit,
    });

    const userRows = users.map((user) => user.toJSON());
    const statsByUserId = await getPredictionStatsByUserId(userRows.map((user) => user.id));

    return userRows.map((user, index) => {
        const stats = statsByUserId.get(user.id) || getDefaultStats();

        return {
            rank: index + 1,
            username: user.username,
            points: Number(user.points || 0),
            ...stats,
        };
    });
};

export { getLeaderboardService };
