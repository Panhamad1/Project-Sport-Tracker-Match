import { getPlayerByApiIdFromDatabaseOnly } from "../services/playerService.js";

const getPlayerById = async (req, res) => {
    try {
        const apiPlayerId = Number(req.params.playerId);
        const seasonQuery = req.query.season;

        if(!Number.isInteger(apiPlayerId) || apiPlayerId <= 0){
            return res.status(400).json({
                message: "Invalid player id",
            });
        }

        let season = null;

        if(seasonQuery !== undefined && seasonQuery !== ""){
            season = Number(seasonQuery);

            if(!Number.isInteger(season) || season <= 0){
                return res.status(400).json({
                    message: "Invalid season. Use a positive year",
                });
            }
        }

        const result = await getPlayerByApiIdFromDatabaseOnly(apiPlayerId, { season });

        if(!result.player){
            return res.status(404).json({
                message: "Player not found",
                source: result.source,
                player: null,
                statistics: [],
                statistic_seasons: [],
                selected_statistic_season: null,
            });
        }

        return res.status(200).json({
            message: "Player loaded successfully",
            source: result.source,
            player: result.player,
            statistics: result.statistics,
            statistic_seasons: result.statistic_seasons,
            selected_statistic_season: result.selected_statistic_season,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to load player",
            error: err.message,
        });
    }
};

export { getPlayerById };
