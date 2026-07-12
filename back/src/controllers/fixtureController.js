import { getFixturesByDateFromDatabaseOnly,syncFixtureById,syncFixturesByDateRange } from "../services/fixtureService.js";
// ah nis somrab fetch fixture tam date jg frontend trov bos date oy backend format: YYYY-MM-DD
const getFixturesByDate = async (req,res) => {
    try{
        const { date } = req.params;
        const isValidate = /^\d{4}-\d{2}-\d{2}$/.test(date);
        if(!isValidate){
            return res.status(400).json({
                message: "Invalid Date Format. Use YYYY-MM-DD",
            });
        }
        const result = await getFixturesByDateFromDatabaseOnly(date);
    if (result.status === "failed") {
        return res.status(503).json({
            message: result.message,
            date,
            source: result.source,
            count: 0,
            fixtures: [],
            error_message: result.error_message || null,
        });
    }

    return res.status(200).json({
        message:
          result.fixtures.length === 0
            ? "No fixtures found for this date"
            : "Fixtures loaded successfully",
        date,
        source: result.source,
        timezone: result.timezone,
        count: result.fixtures.length,
        fixtures: result.fixtures,
    });
        
    }catch(err){
        return res.status(500).json({
            message: "Fail To Load The Fixtures",
            error: err.message,
        });
    }
};

const getAdminFixturesByDate = async (req,res) => {
    try{
        const { date } = req.params;
        const isValidate = /^\d{4}-\d{2}-\d{2}$/.test(date);

        if(!isValidate){
            return res.status(400).json({
                message: "Invalid Date Format. Use YYYY-MM-DD",
            });
        }

        const result = await getFixturesByDateFromDatabaseOnly(date, {
            exposeLocalIds: true,
        });

        return res.status(200).json({
            message:
              result.fixtures.length === 0
                ? "No fixtures found for this date"
                : "Admin fixtures loaded successfully",
            date,
            source: result.source,
            timezone: result.timezone,
            count: result.fixtures.length,
            fixtures: result.fixtures,
        });
    }catch(err){
        return res.status(500).json({
            message: "Fail To Load The Fixtures",
            error: err.message,
        });
    }
};

// function nis for backend sync data jol database between ngai
const syncFixtures = async(req,res) =>{
    try{
        const { from, to } = req.query;
        if(!from || !to){
            return res.status(400).json({
                message: "from and to query are required",
                example: "/api/admin/sync/fixtures?from=2026-06-01&to=2026-06-07",
            });
        }
        const results = await syncFixturesByDateRange(from,to);
        return res.status(200).json({
            message: "Fixtures synced successfully",
            from,
            to,
            results,
        });
    }catch(err){
        return res.status(500).json({
        message: "Failed to sync fixtures",
        error: err.message,
        });
    }
};

const syncFixture = async(req,res) =>{
    try{
        const fixtureId = Number(req.params.fixtureId);

        if(!Number.isInteger(fixtureId) || fixtureId <= 0){
            return res.status(400).json({
                message: "Invalid fixture id",
            });
        }

        const result = await syncFixtureById(fixtureId);

        if(result.status === "not_found"){
            return res.status(404).json({
                message: result.message,
                result,
            });
        }

        if(result.status === "skipped"){
            return res.status(400).json({
                message: result.message,
                result,
            });
        }

        return res.status(200).json({
            message: result.message,
            source: "api_football_admin_sync",
            result,
        });
    }catch(err){
        return res.status(500).json({
            message: "Failed to refresh fixture",
            error: err.message,
        });
    }
};

export { getAdminFixturesByDate, getFixturesByDate, syncFixture, syncFixtures};
