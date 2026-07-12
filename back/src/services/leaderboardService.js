import { User } from "../models/index.js";

const getLeaderboardService = async (limit = 50) => {
    const safeLimit = Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 50;

    const users = await User.findAll({
        where: {
            role: "user",
        },
        attributes: ["username", "points"],
        order: [["points", "DESC"], ["created_at", "ASC"]],
        limit: safeLimit,
    });

    return users.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        points: Number(user.points || 0),
    }));
};

export { getLeaderboardService };
