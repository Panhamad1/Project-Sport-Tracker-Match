import { addFavoriteTeamService, getMyFavoriteTeamsService, removeFavoriteTeamService } from "../services/favoriteTeamService.js";

const addFavoriteTeam = async (req,res) =>{
    try{
        const userId = req.user.id;
        const teamId = Number(req.params.teamId);
        if(!Number.isInteger(teamId) || teamId <= 0){
            return res.status(400).json({
                message: "Invalid Team Id",
            });
        }
        const result = await addFavoriteTeamService(userId, teamId);
        if(result.status === "not_found"){
            return res.status(404).json({
                message: result.message,
            });
        }
        return res.status(result.created ? 201:200).json({
            message: result.created ? "Add successfully" : "Team Already Exist",
        });
    }catch(error){
        return res.status(500).json({
            message: "Failed to add Favorite team",
            error: error.message,
        });
    }
};
const getMyFavoriteTeams = async ( req , res ) => {
    try{
        const userId = req.user.id;
        const result = await getMyFavoriteTeamsService(userId);
        return res.status(200).json({
            message: "Load Favorite Success",
            count: result.length,
            result,
        });
    }catch(error){
        return res.status(500).json({
            message: "Fail to load favorite team",
            error: error.message,
        });
    }
};
const RemoveFavoriteTeam = async ( req , res ) => {
    try{
        const userId = req.user.id;
        const teamId = Number(req.params.teamId);
        if(!Number.isInteger(teamId) || teamId <= 0){
            return res.status(404).json({
                message: "Invalid Team Id",
            });
        }
        const result = await removeFavoriteTeamService(userId,teamId);
        if(result === 0){
            return res.status(404).json({
                message: "Team not found",
            });
        }
        return res.status(200).json({
            message: "Remove Success",
        });
    }catch(error){
        return res.status(500).json({
            message: "Fail to delete favorite team",
            error: error.message,
        });
    }
};
export { addFavoriteTeam, getMyFavoriteTeams, RemoveFavoriteTeam};