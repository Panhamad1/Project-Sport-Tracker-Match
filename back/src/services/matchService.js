import { Op } from "sequelize";
import { Fixture, League, MatchDetail, Player, Team } from "../models/index.js";
import { getCambodiaDateTimeFields } from "../utils/cambodiaTime.js";
import { getActiveStreamLinksByFixtureId } from "./streamLinkService.js";

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
        api_team_id: team.api_team_id,
        name: team.name,
        code: team.code,
        country: team.country,
        logo: team.logo,
        venue_name: team.venue_name,
        venue_city: team.venue_city,
    };
};

const buildPublicMatchResponse = (match) => {
    const matchData = match.toJSON();

    return {
        public_match_id: matchData.api_fixture_id,
        api_fixture_id: matchData.api_fixture_id,
        season: matchData.season,
        match_date: matchData.match_date,
        ...getCambodiaDateTimeFields(matchData.match_date),
        status_long: matchData.status_long,
        status_short: matchData.status_short,
        elapsed: matchData.elapsed,
        home_goals: matchData.home_goals,
        away_goals: matchData.away_goals,
        venue_name: matchData.venue_name,
        venue_city: matchData.venue_city,
        league: formatPublicLeague(matchData.league),
        homeTeam: formatPublicTeam(matchData.homeTeam),
        awayTeam: formatPublicTeam(matchData.awayTeam),
        last_updated: matchData.last_updated,
    };
};

const getGoalEvents = (savedDetail) => {
    const events = savedDetail.raw_data?.events?.data || [];

    return events.filter((event) => {
        const eventType = String(event.type || "").toLowerCase();
        const eventDetail = String(event.detail || "").toLowerCase();

        return eventType === "goal" && eventDetail !== "missed penalty";
    });
};

const formatGoalScorer = (event) => {
    const elapsed = event.time?.elapsed;
    const extra = event.time?.extra;
    const minute = extra ? `${elapsed}+${extra}'` : `${elapsed || "-"}'`;

    return {
        minute,
        player_name: event.player?.name || "Unknown Player",
        team_api_id: event.team?.id || null,
        detail: event.detail || "Goal",
    };
};

const buildGoalScorers = (savedDetail, homeTeam, awayTeam) => {
    return getGoalEvents(savedDetail).reduce((summary, event) => {
        const scorer = formatGoalScorer(event);

        if(event.team?.id === homeTeam?.api_team_id){
            summary.home.push(scorer);
            return summary;
        }

        if(event.team?.id === awayTeam?.api_team_id){
            summary.away.push(scorer);
        }

        return summary;
    }, {
        home: [],
        away: [],
    });
};

const collectLineupPlayerIds = (lineups) => {
    const playerIds = [];

    lineups.forEach((lineup) => {
        [...(lineup.startXI || []), ...(lineup.substitutes || [])].forEach((item) => {
            const playerId = Number(item.player?.id);

            if(Number.isInteger(playerId) && playerId > 0){
                playerIds.push(playerId);
            }
        });
    });

    return [...new Set(playerIds)];
};

const attachPlayerPhotosToLineups = async (lineups) => {
    if(lineups.length === 0){
        return [];
    }

    const playerIds = collectLineupPlayerIds(lineups);

    if(playerIds.length === 0){
        return lineups;
    }

    const players = await Player.findAll({
        where: {
            api_player_id: {
                [Op.in]: playerIds,
            },
        },
        attributes: ["api_player_id", "photo"],
    });
    const photoByApiPlayerId = new Map(players.map((player) => [
        player.api_player_id,
        player.photo,
    ]));
    const attachPhoto = (item) => {
        const apiPlayerId = Number(item.player?.id);
        const photo = item.player?.photo || photoByApiPlayerId.get(apiPlayerId) || null;

        return {
            ...item,
            player: {
                ...item.player,
                photo,
            },
        };
    };

    return lineups.map((lineup) => ({
        ...lineup,
        startXI: (lineup.startXI || []).map(attachPhoto),
        substitutes: (lineup.substitutes || []).map(attachPhoto),
    }));
};

const buildMatchDetailsResponse = async (match) => {
    const matchData = match.toJSON();
    const savedDetail = matchData.detail || {};
    const goalScorers = buildGoalScorers(savedDetail, matchData.homeTeam, matchData.awayTeam);
    const lineups = await attachPlayerPhotosToLineups(savedDetail.lineups || []);
    const streamLinks = await getActiveStreamLinksByFixtureId(matchData.id);

    return {
        overview: {
            public_match_id: matchData.api_fixture_id,
            api_fixture_id: matchData.api_fixture_id,
            match_date: matchData.match_date,
            ...getCambodiaDateTimeFields(matchData.match_date),
            status_long: matchData.status_long,
            status_short: matchData.status_short,
            elapsed: matchData.elapsed,
            home_goals: matchData.home_goals,
            away_goals: matchData.away_goals,
            venue_name: matchData.venue_name,
            venue_city: matchData.venue_city,
            league: formatPublicLeague(matchData.league),
            homeTeam: formatPublicTeam(matchData.homeTeam),
            awayTeam: formatPublicTeam(matchData.awayTeam),
            score: matchData.raw_data?.score || null,
            last_updated: matchData.last_updated,
        },
        h2h: savedDetail.h2h || [],
        prediction: savedDetail.prediction || null,
        lineups,
        statistics: savedDetail.statistics || [],
        goal_scorers: goalScorers,
        streams: streamLinks,
        last_synced_at: savedDetail.last_synced_at || null,
    };
};

const getMatchByApiFixtureIdFromDatabaseOnly = async (apiFixtureId) => {
    const match = await Fixture.findOne({
        where: {
            api_fixture_id: apiFixtureId,
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
            {
                model: MatchDetail,
                as: "detail",
            },
        ],
    });

    const details = match ? await buildMatchDetailsResponse(match) : null;
    const publicMatch = match ? buildPublicMatchResponse(match) : null;

    return {
        source: "database_only",
        match: publicMatch,
        details,
        apiRequestUsed: false,
    };
};

export { getMatchByApiFixtureIdFromDatabaseOnly };
