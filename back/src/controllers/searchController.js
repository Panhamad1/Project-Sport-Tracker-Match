import { searchTeamsAndPlayersService } from "../services/searchService.js";

const searchTeamsAndPlayers = async (req, res) => {
    try {
        const search = req.query.search || "";
        const type = req.query.type || "all";

        const allowedTypes = ["all", "teams", "players"];

        if (!allowedTypes.includes(type.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid search type. Use all, teams, or players",
            });
        }

        const result = await searchTeamsAndPlayersService(search, type);

        return res.status(200).json({
            message: search.trim()
                ? "Search results loaded successfully"
                : "Type something to search",
            search,
            type,
            count: {
                teams: result.teams.length,
                players: result.players.length,
            },
            teams: result.teams,
            players: result.players,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to search teams and players",
            error: err.message,
        });
    }
};

export { searchTeamsAndPlayers };