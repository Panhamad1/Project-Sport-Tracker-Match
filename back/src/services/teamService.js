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

const formatPlayerStatistic = (statistic) => {
    const statisticData = typeof statistic.toJSON === "function" ? statistic.toJSON() : statistic;
    const player = statisticData.player || {};

    return {
        id: player.id,
        api_player_id: player.api_player_id,
        name: player.name,
        age: player.age,
        nationality: player.nationality,
        photo: player.photo,
        position: statisticData.position,
        rating: statisticData.rating,
        appearances: statisticData.appearances,
        lineups: statisticData.lineups,
        minutes: statisticData.minutes,
        goals: statisticData.goals,
        assists: statisticData.assists,
        yellow_cards: statisticData.yellow_cards,
        red_cards: statisticData.red_cards,
        season: statisticData.season,
        league: formatPublicLeague(statisticData.league),
        last_updated: statisticData.last_updated,
    };
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

const getTeamByApiIdFromDatabaseOnly = async (apiTeamId) => {
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
            where: {
                team_id: team.id,
            },
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
            limit: 40,
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
        players: playerStatistics.map(formatPlayerStatistic),
        recent_matches: recentMatches,
        upcoming_matches: upcomingMatches,
        apiRequestUsed: false,
    };
};

export { getTeamByApiIdFromDatabaseOnly };
