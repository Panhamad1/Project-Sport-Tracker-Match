import { searchTeamsAndPlayersService } from "../services/searchService.js";

const searchTeamsAndPlayers = async (req, res) => {
    try {
        const search = req.query.search || "";
        const type = req.query.type || "all";

        const allowedTypes = ["all", "teams", "leagues", "players", "matches"];

        if (!allowedTypes.includes(type.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid search type. Use all, teams, leagues, players, or matches",
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
                leagues: result.leagues.length,
                players: result.players.length,
                matches: result.matches.length,
            },
            teams: result.teams,
            leagues: result.leagues,
            players: result.players,
            matches: result.matches,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to search football data",
            error: err.message,
        });
    }
};

export { searchTeamsAndPlayers };
