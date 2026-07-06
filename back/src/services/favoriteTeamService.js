import { FavoriteTeam, Team, User } from "../models/index.js";

const addFavoriteTeamService = async (userId, teamId) =>{
    const team = await Team.findByPk(teamId);
    if(!team){
        return {
            status: "not_found",
            message: "Team not Found",
        };
    }
    const [favoriteTeam, created] = await FavoriteTeam.findOrCreate({
        where: {
            user_id: userId,
            team_id: teamId,
        },
        defaults: {
            user_id: userId,
            team_id: teamId,
        },
    });
    return {
        status: "success",
        created,
        favoriteTeam,
    }
};
const getMyFavoriteTeamsService = async(userId )=> {
    const favoriteTeams = await FavoriteTeam.findAll({
        where: {
            user_id: userId,
        },
        include: [
            {
                model: Team,
                as: "team",
            },
        ],
        order:[["created_at","DESC"]],
    });
    return favoriteTeams;
};

const removeFavoriteTeamService = async(userId, teamId) =>{
    const deleteData = await FavoriteTeam.destroy({
        where: {
            team_id: teamId,
            user_id: userId,
        },
    });  
    return deleteData;
};
export {
    addFavoriteTeamService,
    getMyFavoriteTeamsService,
    removeFavoriteTeamService,
};