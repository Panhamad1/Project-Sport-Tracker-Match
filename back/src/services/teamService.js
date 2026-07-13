import { Op } from "sequelize";
import { Fixture, League, LeagueStanding, Player, PlayerStatistic, Team } from "../models/index.js";
import { getCambodiaDateTimeFields } from "../utils/cambodiaTime.js";

const scheduledStatuses = ["NS", "TBD", "PST"];

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
        founded: team.founded,
        logo: team.logo,
        venue_name: team.venue_name,
        venue_city: team.venue_city,
        last_updated: team.last_updated,
    };
};

const formatPublicFixture = (fixture) => {
    const fixtureData = typeof fixture.toJSON === "function" ? fixture.toJSON() : fixture;

    return {
        public_match_id: fixtureData.api_fixture_id,
        api_fixture_id: fixtureData.api_fixture_id,
        season: fixtureData.season,
        match_date: fixtureData.match_date,
        ...getCambodiaDateTimeFields(fixtureData.match_date),
        status_long: fixtureData.status_long,
        status_short: fixtureData.status_short,
        elapsed: fixtureData.elapsed,
        home_goals: fixtureData.home_goals,
        away_goals: fixtureData.away_goals,
        venue_name: fixtureData.venue_name,
        venue_city: fixtureData.venue_city,
        league: formatPublicLeague(fixtureData.league),
        homeTeam: formatPublicTeam(fixtureData.homeTeam),
        awayTeam: formatPublicTeam(fixtureData.awayTeam),
        last_updated: fixtureData.last_updated,
    };
};

const formatStanding = (standing) => {
    const standingData = typeof standing.toJSON === "function" ? standing.toJSON() : standing;

    return {
        league: formatPublicLeague(standingData.league),
        season: standingData.season,
        rank: standingData.rank,
        points: standingData.points,
        goals_diff: standingData.goals_diff,
        group_name: standingData.group_name,
        form: standingData.form,
        status: standingData.status,
        description: standingData.description,
        played: standingData.played,
        win: standingData.win,
        draw: standingData.draw,
        lose: standingData.lose,
        goals_for: standingData.goals_for,
        goals_against: standingData.goals_against,
        last_updated: standingData.last_updated,
    };
};

const sumStatisticField = (statistics, field) => {
    const values = statistics
        .map((statistic) => statistic[field])
        .filter((value) => value !== null && value !== undefined);

    if(values.length === 0){
        return null;
    }

    return values.reduce((total, value) => total + Number(value || 0), 0);
};

const getAvailablePlayerSeasons = async (teamId) => {
    const seasonRows = await PlayerStatistic.findAll({
        where: {
            team_id: teamId,
        },
        attributes: ["season"],
        group: ["season"],
        order: [["season", "DESC"]],
    });

    return seasonRows
        .map((row) => Number(row.get("season")))
        .filter((season) => Number.isInteger(season));
};

const mergePlayerStatisticsByPlayer = (statistics) => {
    const groupedStatistics = new Map();

    for(const statistic of statistics){
        const statisticData = typeof statistic.toJSON === "function" ? statistic.toJSON() : statistic;
        const player = statisticData.player || {};
        const key = player.api_player_id || player.id;

        if(!key){
            continue;
        }

        if(!groupedStatistics.has(key)){
            groupedStatistics.set(key, []);
        }

        groupedStatistics.get(key).push(statisticData);
    }

    return Array.from(groupedStatistics.values())
        .map((playerStatistics) => {
            const sortedStatistics = [...playerStatistics].sort((first, second) => {
                return Number(second.appearances || 0) - Number(first.appearances || 0)
                    || Number(second.minutes || 0) - Number(first.minutes || 0);
            });
            const mainStatistic = sortedStatistics[0];
            const player = mainStatistic.player || {};
            const competitions = sortedStatistics
                .map((statistic) => formatPublicLeague(statistic.league))
                .filter(Boolean);

            return {
                id: player.id,
                api_player_id: player.api_player_id,
                name: player.name,
                age: player.age,
                nationality: player.nationality,
                photo: player.photo,
                position: mainStatistic.position,
                rating: mainStatistic.rating,
                appearances: sumStatisticField(playerStatistics, "appearances"),
                lineups: sumStatisticField(playerStatistics, "lineups"),
                minutes: sumStatisticField(playerStatistics, "minutes"),
                goals: sumStatisticField(playerStatistics, "goals"),
                assists: sumStatisticField(playerStatistics, "assists"),
                yellow_cards: sumStatisticField(playerStatistics, "yellow_cards"),
                red_cards: sumStatisticField(playerStatistics, "red_cards"),
                season: mainStatistic.season,
                league: competitions[0] || null,
                competitions,
                competitions_count: competitions.length,
                last_updated: mainStatistic.last_updated,
            };
        })
        .sort((first, second) => {
            return Number(second.appearances || 0) - Number(first.appearances || 0)
                || Number(second.minutes || 0) - Number(first.minutes || 0)
                || String(first.name || "").localeCompare(String(second.name || ""));
        });
};

const getTeamFixtures = async ({ teamId, direction }) => {
    const now = new Date();
    const matchDateWhere = direction === "upcoming"
        ? {
            [Op.gte]: now,
        }
        : {
            [Op.lt]: now,
        };
    const extraWhere = direction === "upcoming"
        ? {
            status_short: {
                [Op.in]: scheduledStatuses,
            },
        }
        : {};

    const fixtures = await Fixture.findAll({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        { home_team_id: teamId },
                        { away_team_id: teamId },
                    ],
                },
                {
                    match_date: matchDateWhere,
                },
                extraWhere,
            ],
        },
        include: [
            {
                model: League,
                as: "league",
            },
            {
                model: Team,
                as: "homeTeam",
            },
            {
                model: Team,
                as: "awayTeam",
            },
        ],
        order: [["match_date", direction === "upcoming" ? "ASC" : "DESC"]],
        limit: 8,
    });

    return fixtures.map(formatPublicFixture);
};

const getTeamByApiIdFromDatabaseOnly = async (apiTeamId, { playerSeason = null } = {}) => {
    const team = await Team.findOne({
        where: {
            api_team_id: apiTeamId,
        },
    });

    if(!team){
        return {
            source: "database_only",
            team: null,
            apiRequestUsed: false,
        };
    }

    const playerSeasons = await getAvailablePlayerSeasons(team.id);
    const selectedPlayerSeason = playerSeason || playerSeasons[0] || null;
    const playerStatisticWhere = {
        team_id: team.id,
    };

    if(selectedPlayerSeason){
        playerStatisticWhere.season = selectedPlayerSeason;
    }

    const [standings, playerStatistics, recentMatches, upcomingMatches] = await Promise.all([
        LeagueStanding.findAll({
            where: {
                team_id: team.id,
            },
            include: [
                {
                    model: League,
                    as: "league",
                },
            ],
            order: [["season", "DESC"], ["rank", "ASC"]],
            limit: 12,
        }),
        PlayerStatistic.findAll({
            where: playerStatisticWhere,
            include: [
                {
                    model: Player,
                    as: "player",
                },
                {
                    model: League,
                    as: "league",
                },
            ],
            order: [["season", "DESC"], ["appearances", "DESC"], ["minutes", "DESC"]],
            limit: 120,
        }),
        getTeamFixtures({
            teamId: team.id,
            direction: "recent",
        }),
        getTeamFixtures({
            teamId: team.id,
            direction: "upcoming",
        }),
    ]);

    return {
        source: "database_only",
        team: formatPublicTeam(team),
        standings: standings.map(formatStanding),
        players: mergePlayerStatisticsByPlayer(playerStatistics),
        player_seasons: playerSeasons,
        selected_player_season: selectedPlayerSeason,
        recent_matches: recentMatches,
        upcoming_matches: upcomingMatches,
        apiRequestUsed: false,
    };
};

export { getTeamByApiIdFromDatabaseOnly };
