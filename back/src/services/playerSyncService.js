import {
    League,
    Player,
    PlayerStatistic,
    Team,
} from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";

const MAX_PLAYER_SYNC_PAGES = 3;

const sleep = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const saveOrUpdateLeague = async (apiLeague, fallbackSeason = null) => {
    if (!apiLeague?.id) {
        return null;
    }

    const season = apiLeague.season || fallbackSeason;

    if (!season) {
        return null;
    }

    const values = {
        api_league_id: apiLeague.id,
        name: apiLeague.name || `League ${apiLeague.id}`,
        type: null,
        logo: apiLeague.logo || null,
        country: apiLeague.country || null,
        season,
        raw_data: {
            ...apiLeague,
            season,
        },
        last_updated: new Date(),
    };

    const [league, created] = await League.findOrCreate({
        where: {
            api_league_id: apiLeague.id,
            season,
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

const saveOrUpdateTeam = async (apiTeam) => {
    if (!apiTeam?.id || !apiTeam?.name) {
        return null;
    }

    const values = {
        api_team_id: apiTeam.id,
        name: apiTeam.name,
        code: apiTeam.code || null,
        country: apiTeam.country || null,
        founded: apiTeam.founded ?? null,
        logo: apiTeam.logo || null,
        venue_name: null,
        venue_city: null,
        raw_data: apiTeam,
        last_updated: new Date(),
    };

    const [team, created] = await Team.findOrCreate({
        where: {
            api_team_id: apiTeam.id,
        },
        defaults: values,
    });

    if (!created) {
        await team.update({
            name: apiTeam.name || team.name,
            logo: apiTeam.logo || team.logo,
            raw_data: apiTeam,
            last_updated: new Date(),
        });
    }

    return team;
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

const syncPlayersByTeamSeason = async ({ teamApiId, season }) => {
    const localTeam = await Team.findOne({
        where: {
            api_team_id: teamApiId,
        },
    });

    if (!localTeam) {
        throw new Error("Team not found in database. Run team sync first.");
    }

    let currentPage = 1;
    let totalPages = 1;
    let savedPlayersCount = 0;
    let savedStatisticsCount = 0;
    const syncedPlayerIds = new Set();
    const syncedLeagueIds = new Set();

    while (currentPage <= totalPages && currentPage <= MAX_PLAYER_SYNC_PAGES) {
        const apiData = await apiFootballGet("/players", {
            team: teamApiId,
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

            const statistics = (apiPlayerData.statistics || []).filter((apiStatistic) => {
                return (
                    Number(apiStatistic.team?.id) === teamApiId &&
                    Number(apiStatistic.league?.season || season) === season
                );
            });

            for (const statistic of statistics) {
                const localLeague = await saveOrUpdateLeague(statistic.league, season);

                if (!localLeague) {
                    continue;
                }

                syncedLeagueIds.add(localLeague.api_league_id);

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
        season,
        players_count: savedPlayersCount,
        statistics_count: savedStatisticsCount,
        leagues_count: syncedLeagueIds.size,
        leagues_synced: Array.from(syncedLeagueIds),
        pages_synced: currentPage - 1,
        total_pages: totalPages,
        stopped_early: totalPages > MAX_PLAYER_SYNC_PAGES,
        max_pages_allowed: MAX_PLAYER_SYNC_PAGES,
    };
};

const syncPlayerByIdSeason = async ({ playerApiId, season }) => {
    let currentPage = 1;
    let totalPages = 1;
    let savedPlayersCount = 0;
    let savedStatisticsCount = 0;
    const syncedPlayerIds = new Set();
    const syncedTeamIds = new Set();
    const syncedLeagueIds = new Set();

    while (currentPage <= totalPages && currentPage <= MAX_PLAYER_SYNC_PAGES) {
        const apiData = await apiFootballGet("/players", {
            id: playerApiId,
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

            const statistics = (apiPlayerData.statistics || []).filter((apiStatistic) => {
                return Number(apiStatistic.league?.season || season) === season;
            });

            for (const statistic of statistics) {
                const localTeam = await saveOrUpdateTeam(statistic.team);
                const localLeague = await saveOrUpdateLeague(statistic.league, season);

                if (!localTeam || !localLeague) {
                    continue;
                }

                syncedTeamIds.add(localTeam.api_team_id);
                syncedLeagueIds.add(localLeague.api_league_id);

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
        playerApiId,
        season,
        players_count: savedPlayersCount,
        statistics_count: savedStatisticsCount,
        teams_count: syncedTeamIds.size,
        teams_synced: Array.from(syncedTeamIds),
        leagues_count: syncedLeagueIds.size,
        leagues_synced: Array.from(syncedLeagueIds),
        pages_synced: currentPage - 1,
        total_pages: totalPages,
        stopped_early: totalPages > MAX_PLAYER_SYNC_PAGES,
        max_pages_allowed: MAX_PLAYER_SYNC_PAGES,
    };
};

export { syncPlayerByIdSeason, syncPlayersByTeamSeason };
