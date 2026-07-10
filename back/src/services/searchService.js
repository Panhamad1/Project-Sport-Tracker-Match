import { Op } from "sequelize";
import { Team, Player } from "../models/index.js";

const searchTeamsAndPlayersService = async (search= "", type= "all") => {
    const keyword= search.trim();

    if (!keyword) {
        return {
            teams:[],
            players:[],
        };
    }

    const searchType = type.toLowerCase();

    let teams =[];
    let players =[];

    if (searchType === "all" || searchType === "teams") {
        teams = await Team.findAll({
            where: {
                name: {
                    [Op.like]: `%${keyword}%`,
                },
            },
            attributes: [
                "id",
                "api_team_id",
                "name",
                "code",
                "country",
                "logo",
            ],
            order: [["name", "ASC"]],
            limit: 10,
        });
    }

    if (searchType === "all" || searchType === "players") {
        players = await Player.findAll({
            where: {
                name: {
                    [Op.like]: `%${keyword}%`,
                },
            },
            attributes: [
                "id",
                "api_player_id",
                "name",
                "firstname",
                "lastname",
                "age",
                "nationality",
                "photo",
            ],
            order: [["name", "ASC"]],
            limit: 10,
        });
    }

    return {
        teams,
        players,
    };
};

export { searchTeamsAndPlayersService };