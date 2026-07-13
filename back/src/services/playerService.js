import { League, Player, PlayerStatistic, Team } from "../models/index.js";

const formatPublicLeague = (league) => {
    if(!league){
        return null;
    }

    return {
        api_league_id: league.api_league_id,
        name: league.name,
        type: league.type,
        logo: league.logo,
        country: league.country,
        season: league.season,
    };
};

const formatPublicTeam = (team) => {
    if(!team){
        return null;
    }

    return {
        id: team.id,
        api_team_id: team.api_team_id,
        name: team.name,
        code: team.code,
        country: team.country,
        logo: team.logo,
    };
};

const formatPublicPlayer = (player) => {
    if(!player){
        return null;
    }

    return {
        id: player.id,
        api_player_id: player.api_player_id,
        name: player.name,
        firstname: player.firstname,
        lastname: player.lastname,
        age: player.age,
        nationality: player.nationality,
        height: player.height,
        weight: player.weight,
        injured: player.injured,
        photo: player.photo,
        last_updated: player.last_updated,
    };
};

const formatStatistic = (statistic) => {
    const statisticData = typeof statistic.toJSON === "function" ? statistic.toJSON() : statistic;

    return {
        team: formatPublicTeam(statisticData.team),
        league: formatPublicLeague(statisticData.league),
        season: statisticData.season,
        position: statisticData.position,
        rating: statisticData.rating,
        appearances: statisticData.appearances,
        lineups: statisticData.lineups,
        minutes: statisticData.minutes,
        goals: statisticData.goals,
        assists: statisticData.assists,
        yellow_cards: statisticData.yellow_cards,
        red_cards: statisticData.red_cards,
        last_updated: statisticData.last_updated,
    };
};

const getAvailableStatisticSeasons = async (playerId) => {
    const seasonRows = await PlayerStatistic.findAll({
        where: {
            player_id: playerId,
        },
        attributes: ["season"],
        group: ["season"],
        order: [["season", "DESC"]],
    });

    return seasonRows
        .map((row) => Number(row.get("season")))
        .filter((season) => Number.isInteger(season));
};

const getPlayerByApiIdFromDatabaseOnly = async (apiPlayerId, { season = null } = {}) => {
    const player = await Player.findOne({
        where: {
            api_player_id: apiPlayerId,
        },
    });

    if(!player){
        return {
            source: "database_only",
            player: null,
            statistics: [],
            statistic_seasons: [],
            selected_statistic_season: null,
            apiRequestUsed: false,
        };
    }

    const statisticSeasons = await getAvailableStatisticSeasons(player.id);
    const selectedStatisticSeason = season || statisticSeasons[0] || null;
    const statisticWhere = {
        player_id: player.id,
    };

    if(selectedStatisticSeason){
        statisticWhere.season = selectedStatisticSeason;
    }

    const statistics = await PlayerStatistic.findAll({
        where: statisticWhere,
        include: [
            {
                model: Team,
                as: "team",
            },
            {
                model: League,
                as: "league",
            },
        ],
        order: [["season", "DESC"], ["appearances", "DESC"], ["minutes", "DESC"]],
    });

    return {
        source: "database_only",
        player: formatPublicPlayer(player),
        statistics: statistics.map(formatStatistic),
        statistic_seasons: statisticSeasons,
        selected_statistic_season: selectedStatisticSeason,
        apiRequestUsed: false,
    };
};

export { getPlayerByApiIdFromDatabaseOnly };
