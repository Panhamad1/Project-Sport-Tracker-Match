import { getPlayerByApiIdFromDatabaseOnly } from "../services/playerService.js";

const getPlayerById = async (req, res) => {
    try {
        const apiPlayerId = Number(req.params.playerId);

        if(!Number.isInteger(apiPlayerId) || apiPlayerId <= 0){
            return res.status(400).json({
                message: "Invalid player id",
            });
        }

        const result = await getPlayerByApiIdFromDatabaseOnly(apiPlayerId);

        if(!result.player){
            return res.status(404).json({
                message: "Player not found",
                source: result.source,
                player: null,
                statistics: [],
            });
        }

        return res.status(200).json({
            message: "Player loaded successfully",
            source: result.source,
            player: result.player,
            statistics: result.statistics,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to load player",
            error: err.message,
        });
    }
};

export { getPlayerById };
