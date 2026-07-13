import { Op } from "sequelize";
import { Fixture, League, Player, PlayerStatistic, Team } from "../models/index.js";
import { getCambodiaDateTimeFields } from "../utils/cambodiaTime.js";

const PLAYER_POSITION_FILTERS = {
    gk: {
        label: "GK",
        values: ["Goalkeeper"],
    },
    def: {
        label: "DEF",
        values: ["Defender"],
    },
    mid: {
        label: "MID",
        values: ["Midfielder"],
    },
    fwd: {
        label: "FWD",
        values: ["Attacker"],
    },
};

const formatTeamResult = (team) => {
    const teamData = typeof team.toJSON === "function" ? team.toJSON() : team;

    return {
        api_team_id: teamData.api_team_id,
        name: teamData.name,
        code: teamData.code,
        country: teamData.country,
        logo: teamData.logo,
    };
};

const formatLeagueResult = (league) => {
    const leagueData = typeof league.toJSON === "function" ? league.toJSON() : league;

    return {
        api_league_id: leagueData.api_league_id,
        name: leagueData.name,
        type: leagueData.type,
        logo: leagueData.logo,
        country: leagueData.country,
        season: leagueData.season,
    };
};

const getPlayerDisplayName = (playerData) => {
    const fullName = [playerData.firstname, playerData.lastname]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || playerData.name;
};

const formatPlayerResult = (player, position = null) => {
    const playerData = typeof player.toJSON === "function" ? player.toJSON() : player;
    const displayName = getPlayerDisplayName(playerData);

    return {
        api_player_id: playerData.api_player_id,
        name: playerData.name,
        display_name: displayName,
        full_name: displayName,
        firstname: playerData.firstname,
        lastname: playerData.lastname,
        age: playerData.age,
        nationality: playerData.nationality,
        photo: playerData.photo,
        position,
    };
};

const formatMatchResult = (fixture) => {
    const fixtureData = fixture.toJSON();

    return {
        public_match_id: fixtureData.api_fixture_id,
        api_fixture_id: fixtureData.api_fixture_id,
        season: fixtureData.season,
        match_date: fixtureData.match_date,
        status_long: fixtureData.status_long,
        status_short: fixtureData.status_short,
        elapsed: fixtureData.elapsed,
        home_goals: fixtureData.home_goals,
        away_goals: fixtureData.away_goals,
        venue_name: fixtureData.venue_name,
        venue_city: fixtureData.venue_city,
        league: fixtureData.league ? formatLeagueResult(fixtureData.league) : null,
        homeTeam: fixtureData.homeTeam ? formatTeamResult(fixtureData.homeTeam) : null,
        awayTeam: fixtureData.awayTeam ? formatTeamResult(fixtureData.awayTeam) : null,
        last_updated: fixtureData.last_updated,
        ...getCambodiaDateTimeFields(fixtureData.match_date),
    };
};

const findMatchingTeams = async (keyword, limit = 10) => {
    return Team.findAll({
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
        limit,
    });
};

const findMatchingLeagues = async (keyword, limit = 10) => {
    return League.findAll({
        where: {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${keyword}%`,
                    },
                },
                {
                    country: {
                        [Op.like]: `%${keyword}%`,
                    },
                },
            ],
        },
        attributes: [
            "id",
            "api_league_id",
            "name",
            "type",
            "logo",
            "country",
            "season",
        ],
        order: [["name", "ASC"], ["season", "DESC"]],
        limit,
    });
};

const getPlayerPositionFilter = (position) => {
    if (!position || position.toLowerCase() === "all") {
        return null;
    }

    return PLAYER_POSITION_FILTERS[position.toLowerCase()] || null;
};

const findMatchingPlayers = async (keyword, position = "all") => {
    const positionFilter = getPlayerPositionFilter(position);
    let playerIdFilter = null;

    if (positionFilter) {
        const statistics = await PlayerStatistic.findAll({
            where: {
                position: {
                    [Op.in]: positionFilter.values,
                },
            },
            attributes: ["player_id"],
            group: ["player_id"],
        });

        playerIdFilter = statistics.map((statistic) => statistic.player_id);

        if (playerIdFilter.length === 0) {
            return [];
        }
    }

    const searchFilter = {
        [Op.or]: [
            {
                name: {
                    [Op.like]: `%${keyword}%`,
                },
            },
            {
                firstname: {
                    [Op.like]: `%${keyword}%`,
                },
            },
            {
                lastname: {
                    [Op.like]: `%${keyword}%`,
                },
            },
        ],
    };
    const where = playerIdFilter
        ? {
            [Op.and]: [
                searchFilter,
                {
                    id: {
                        [Op.in]: playerIdFilter,
                    },
                },
            ],
        }
        : searchFilter;

    return Player.findAll({
        where,
        attributes: [
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
};

const findMatchingMatches = async ({ teamIds, leagueIds }) => {
    const matchFilters = [];

    if (teamIds.length > 0) {
        matchFilters.push(
            {
                home_team_id: {
                    [Op.in]: teamIds,
                },
            },
            {
                away_team_id: {
                    [Op.in]: teamIds,
                },
            },
        );
    }

    if (leagueIds.length > 0) {
        matchFilters.push({
            league_id: {
                [Op.in]: leagueIds,
            },
        });
    }

    if (matchFilters.length === 0) {
        return [];
    }

    return Fixture.findAll({
        where: {
            [Op.or]: matchFilters,
        },
        include: [
            {
                model: League,
                as: "league",
                attributes: ["api_league_id", "name", "type", "logo", "country", "season"],
            },
            {
                model: Team,
                as: "homeTeam",
                attributes: ["api_team_id", "name", "code", "country", "logo"],
            },
            {
                model: Team,
                as: "awayTeam",
                attributes: ["api_team_id", "name", "code", "country", "logo"],
            },
        ],
        order: [["match_date", "DESC"]],
        limit: 10,
    });
};

const searchTeamsAndPlayersService = async (search= "", type= "all", filters = {}) => {
    const keyword= search.trim();
    const playerPositionFilter = getPlayerPositionFilter(filters.playerPosition);

    if (!keyword) {
        return {
            teams:[],
            leagues: [],
            players:[],
            matches: [],
        };
    }

    const searchType = type.toLowerCase();

    let teams =[];
    let leagues = [];
    let players =[];
    let matches = [];
    let matchingTeamsForMatches = [];
    let matchingLeaguesForMatches = [];

    if (searchType === "all" || searchType === "matches") {
        matchingTeamsForMatches = await findMatchingTeams(keyword, 30);
        matchingLeaguesForMatches = await findMatchingLeagues(keyword, 30);
    }

    if (searchType === "all" || searchType === "teams") {
        teams = matchingTeamsForMatches.length > 0
            ? matchingTeamsForMatches.slice(0, 10)
            : await findMatchingTeams(keyword);
    }

    if (searchType === "all" || searchType === "leagues") {
        leagues = matchingLeaguesForMatches.length > 0
            ? matchingLeaguesForMatches.slice(0, 10)
            : await findMatchingLeagues(keyword);
    }

    if (searchType === "all" || searchType === "players") {
        players = await findMatchingPlayers(keyword, filters.playerPosition);
    }

    if (searchType === "all" || searchType === "matches") {
        matches = await findMatchingMatches({
            teamIds: matchingTeamsForMatches.map((team) => team.id),
            leagueIds: matchingLeaguesForMatches.map((league) => league.id),
        });
    }

    return {
        teams: teams.map(formatTeamResult),
        leagues: leagues.map(formatLeagueResult),
        players: players.map((player) => formatPlayerResult(player, playerPositionFilter?.label || null)),
        matches: matches.map(formatMatchResult),
    };
};

export { searchTeamsAndPlayersService };
