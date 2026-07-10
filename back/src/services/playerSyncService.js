import {
    League,
    Player,
    PlayerStatistic,
    Team,
} from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";

const MAX_PLAYER_SYNC_PAGES = 10;

const sleep = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const saveOrUpdateLeague = async (apiLeague) => {
    if (!apiLeague?.id || !apiLeague?.season) {
        return null;
    }

    const values = {
        api_league_id: apiLeague.id,
        name: apiLeague.name || `League ${apiLeague.id}`,
        type: null,
        logo: apiLeague.logo || null,
        country: apiLeague.country || null,
        season: apiLeague.season,
        raw_data: apiLeague,
        last_updated: new Date(),
    };

    const [league, created] = await League.findOrCreate({
        where: {
            api_league_id: apiLeague.id,
            season: apiLeague.season,
        },
        defaults: values,
    });

    if (!created) {
        await league.update(values);
    }

    return league;
};

const saveOrUpdatePlayer = async (apiPlayer) => {
    if (!apiPlayer?.id || !apiPlayer?.name) {
        return null;
    }

    const values = {
        api_player_id: apiPlayer.id,
        name: apiPlayer.name,
        firstname: apiPlayer.firstname || null,
        lastname: apiPlayer.lastname || null,
        age: apiPlayer.age ?? null,
        nationality: apiPlayer.nationality || null,
        height: apiPlayer.height || null,
        weight: apiPlayer.weight || null,
        injured: apiPlayer.injured ?? null,
        photo: apiPlayer.photo || null,
        raw_data: apiPlayer,
        last_updated: new Date(),
    };

    const [player, created] = await Player.findOrCreate({
        where: {
            api_player_id: apiPlayer.id,
        },
        defaults: values,
    });

    if (!created) {
        await player.update(values);
    }

    return player;
};

const saveOrUpdatePlayerStatistic = async ({
    player,
    team,
    league,
    season,
    apiStatistic,
}) => {
    const values = {
        player_id: player.id,
        team_id: team.id,
        league_id: league.id,
        season,
        position: apiStatistic.games?.position || null,
        rating: apiStatistic.games?.rating || null,
        appearances: apiStatistic.games?.appearences ?? null,
        lineups: apiStatistic.games?.lineups ?? null,
        minutes: apiStatistic.games?.minutes ?? null,
        goals: apiStatistic.goals?.total ?? null,
        assists: apiStatistic.goals?.assists ?? null,
        yellow_cards: apiStatistic.cards?.yellow ?? null,
        red_cards: apiStatistic.cards?.red ?? null,
        raw_data: apiStatistic,
        last_updated: new Date(),
    };

    const [playerStatistic, created] = await PlayerStatistic.findOrCreate({
        where: {
            player_id: player.id,
            team_id: team.id,
            league_id: league.id,
            season,
        },
        defaults: values,
    });

    if (!created) {
        await playerStatistic.update(values);
    }

    return playerStatistic;
};

const syncPlayersByTeamLeagueSeason = async ({ teamApiId, league, season }) => {
    const localTeam = await Team.findOne({
        where: {
            api_team_id: teamApiId,
        },
    });

    if (!localTeam) {
        throw new Error("Team not found in database. Run team sync first.");
    }

    let localLeague = await League.findOne({
        where: {
            api_league_id: league,
            season,
        },
    });

    let currentPage = 1;
    let totalPages = 1;
    let savedPlayersCount = 0;
    let savedStatisticsCount = 0;
    const syncedPlayerIds = new Set();

    while (currentPage <= totalPages && currentPage <= MAX_PLAYER_SYNC_PAGES) {
        const apiData = await apiFootballGet("/players", {
            team: teamApiId,
            league,
            season,
            page: currentPage,
        });

        const apiPlayers = apiData.response || [];
        totalPages = Number(apiData.paging?.total || 1);

        for (const apiPlayerData of apiPlayers) {
            const player = await saveOrUpdatePlayer(apiPlayerData.player);
            if (!player) {
                continue;
            }

            syncedPlayerIds.add(player.id);

            const statistic = (apiPlayerData.statistics || []).find((apiStatistic) => {
                return (
                    Number(apiStatistic.team?.id) === teamApiId &&
                    Number(apiStatistic.league?.id) === league &&
                    Number(apiStatistic.league?.season) === season
                );
            });

            if (statistic) {
                if (!localLeague) {
                    localLeague = await saveOrUpdateLeague(statistic.league);
                }

                if (!localLeague) {
                    throw new Error("League data missing from API response. Cannot save player statistics.");
                }

                await saveOrUpdatePlayerStatistic({
                    player,
                    team: localTeam,
                    league: localLeague,
                    season,
                    apiStatistic: statistic,
                });
                savedStatisticsCount += 1;
            }
        }

        savedPlayersCount = syncedPlayerIds.size;
        currentPage += 1;

        if (currentPage <= totalPages && currentPage <= MAX_PLAYER_SYNC_PAGES) {
            await sleep(1);
        }
    }

    return {
        teamApiId,
        league,
        season,
        players_count: savedPlayersCount,
        statistics_count: savedStatisticsCount,
        pages_synced: currentPage - 1,
        total_pages: totalPages,
        stopped_early: totalPages > MAX_PLAYER_SYNC_PAGES,
    };
};

export { syncPlayersByTeamLeagueSeason };
