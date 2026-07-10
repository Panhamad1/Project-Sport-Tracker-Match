import { getLeagueStandingsFromDatabaseOnly } from "../services/leagueService.js";

const getLeagueStandings = async (req, res) => {
    try {
        const league = Number(req.params.leagueId);
        const season = Number(req.query.season);

        if (!Number.isInteger(league) || league <= 0) {
            return res.status(400).json({
                message: "Invalid league id",
            });
        }

        if (!Number.isInteger(season) || season <= 0) {
            return res.status(400).json({
                message: "season query is required. Use a positive year",
                example: "/api/football/leagues/39/standings?season=2024",
            });
        }

        const result = await getLeagueStandingsFromDatabaseOnly({
            league,
            season,
        });

        if (!result.league) {
            return res.status(404).json({
                message: "League standings not found",
                source: result.source,
                league,
                season,
                standings: [],
            });
        }

        const leagueData = result.league.toJSON();
        delete leagueData.standings;

        return res.status(200).json({
            message: result.standings.length === 0 ? "No standings found for this league and season" : "League standings loaded successfully",
            source: result.source,
            league: leagueData,
            count: result.standings.length,
            standings: result.standings,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to load league standings",
            error: err.message,
        });
    }
};

export { getLeagueStandings };
