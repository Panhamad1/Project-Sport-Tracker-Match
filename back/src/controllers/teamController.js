import { getTeamByApiIdFromDatabaseOnly } from "../services/teamService.js";

const getTeamById = async (req, res) => {
    try {
        const apiTeamId = Number(req.params.teamId);

        if(!Number.isInteger(apiTeamId) || apiTeamId <= 0){
            return res.status(400).json({
                message: "Invalid team id",
            });
        }

        const result = await getTeamByApiIdFromDatabaseOnly(apiTeamId);

        if(!result.team){
            return res.status(404).json({
                message: "Team not found",
                source: result.source,
                team: null,
            });
        }

        return res.status(200).json({
            message: "Team loaded successfully",
            source: result.source,
            team: result.team,
            standings: result.standings,
            players: result.players,
            recent_matches: result.recent_matches,
            upcoming_matches: result.upcoming_matches,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to load team",
            error: err.message,
        });
    }
};

export { getTeamById };
