import { Op } from "sequelize";
import { DreamTeam, Player } from "../models/index.js";

const FORMATIONS = {
    "4-3-3": [
        { slot: "GK", position: "GK", x: 50, y: 90 },
        { slot: "LB", position: "DEF", x: 18, y: 70 },
        { slot: "LCB", position: "DEF", x: 38, y: 72 },
        { slot: "RCB", position: "DEF", x: 62, y: 72 },
        { slot: "RB", position: "DEF", x: 82, y: 70 },
        { slot: "LCM", position: "MID", x: 30, y: 50 },
        { slot: "CM", position: "MID", x: 50, y: 46 },
        { slot: "RCM", position: "MID", x: 70, y: 50 },
        { slot: "LW", position: "FWD", x: 20, y: 24 },
        { slot: "ST", position: "FWD", x: 50, y: 18 },
        { slot: "RW", position: "FWD", x: 80, y: 24 },
    ],
    "4-4-2": [
        { slot: "GK", position: "GK", x: 50, y: 90 },
        { slot: "LB", position: "DEF", x: 18, y: 70 },
        { slot: "LCB", position: "DEF", x: 38, y: 72 },
        { slot: "RCB", position: "DEF", x: 62, y: 72 },
        { slot: "RB", position: "DEF", x: 82, y: 70 },
        { slot: "LM", position: "MID", x: 18, y: 48 },
        { slot: "LCM", position: "MID", x: 40, y: 50 },
        { slot: "RCM", position: "MID", x: 60, y: 50 },
        { slot: "RM", position: "MID", x: 82, y: 48 },
        { slot: "LS", position: "FWD", x: 40, y: 20 },
        { slot: "RS", position: "FWD", x: 60, y: 20 },
    ],
    "4-2-3-1": [
        { slot: "GK", position: "GK", x: 50, y: 90 },
        { slot: "LB", position: "DEF", x: 18, y: 70 },
        { slot: "LCB", position: "DEF", x: 38, y: 72 },
        { slot: "RCB", position: "DEF", x: 62, y: 72 },
        { slot: "RB", position: "DEF", x: 82, y: 70 },
        { slot: "LDM", position: "MID", x: 40, y: 55 },
        { slot: "RDM", position: "MID", x: 60, y: 55 },
        { slot: "LAM", position: "MID", x: 24, y: 36 },
        { slot: "CAM", position: "MID", x: 50, y: 32 },
        { slot: "RAM", position: "MID", x: 76, y: 36 },
        { slot: "ST", position: "FWD", x: 50, y: 17 },
    ],
    "3-5-2": [
        { slot: "GK", position: "GK", x: 50, y: 90 },
        { slot: "LCB", position: "DEF", x: 30, y: 72 },
        { slot: "CB", position: "DEF", x: 50, y: 75 },
        { slot: "RCB", position: "DEF", x: 70, y: 72 },
        { slot: "LWB", position: "MID", x: 15, y: 50 },
        { slot: "LCM", position: "MID", x: 36, y: 50 },
        { slot: "CM", position: "MID", x: 50, y: 45 },
        { slot: "RCM", position: "MID", x: 64, y: 50 },
        { slot: "RWB", position: "MID", x: 85, y: 50 },
        { slot: "LS", position: "FWD", x: 40, y: 20 },
        { slot: "RS", position: "FWD", x: 60, y: 20 },
    ],
    "3-4-3": [
        { slot: "GK", position: "GK", x: 50, y: 90 },
        { slot: "LCB", position: "DEF", x: 30, y: 72 },
        { slot: "CB", position: "DEF", x: 50, y: 75 },
        { slot: "RCB", position: "DEF", x: 70, y: 72 },
        { slot: "LM", position: "MID", x: 18, y: 50 },
        { slot: "LCM", position: "MID", x: 40, y: 50 },
        { slot: "RCM", position: "MID", x: 60, y: 50 },
        { slot: "RM", position: "MID", x: 82, y: 50 },
        { slot: "LW", position: "FWD", x: 20, y: 24 },
        { slot: "ST", position: "FWD", x: 50, y: 18 },
        { slot: "RW", position: "FWD", x: 80, y: 24 },
    ],
    "5-3-2": [
        { slot: "GK", position: "GK", x: 50, y: 90 },
        { slot: "LWB", position: "DEF", x: 12, y: 68 },
        { slot: "LCB", position: "DEF", x: 32, y: 72 },
        { slot: "CB", position: "DEF", x: 50, y: 75 },
        { slot: "RCB", position: "DEF", x: 68, y: 72 },
        { slot: "RWB", position: "DEF", x: 88, y: 68 },
        { slot: "LCM", position: "MID", x: 32, y: 48 },
        { slot: "CM", position: "MID", x: 50, y: 45 },
        { slot: "RCM", position: "MID", x: 68, y: 48 },
        { slot: "LS", position: "FWD", x: 40, y: 20 },
        { slot: "RS", position: "FWD", x: 60, y: 20 },
    ],
};

const DEFAULT_FORMATION = "4-3-3";
const DEFAULT_NAME = "My Dream Team";

const cleanText = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    const trimmedValue = value.trim();
    return trimmedValue ? trimmedValue : null;
};

const getPositiveInteger = (value) => {
    const numberValue = Number(value);

    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const getFormationSlots = (formation) => {
    return FORMATIONS[formation] || [];
};

const getFormationSlotMap = (formation) => {
    return new Map(getFormationSlots(formation).map((slot) => [slot.slot, slot]));
};

const getDreamTeamFormationsService = () => {
    return Object.entries(FORMATIONS).map(([formation, slots]) => ({
        formation,
        slots,
    }));
};

const formatDreamTeam = (dreamTeam) => {
    if (!dreamTeam) {
        return null;
    }

    const dreamTeamData = typeof dreamTeam.toJSON === "function"
        ? dreamTeam.toJSON()
        : dreamTeam;

    return {
        dream_team_id: dreamTeamData.id,
        name: dreamTeamData.name,
        formation: dreamTeamData.formation,
        formation_slots: getFormationSlots(dreamTeamData.formation),
        players: dreamTeamData.players || [],
        created_at: dreamTeamData.created_at || dreamTeamData.createdAt,
        updated_at: dreamTeamData.updated_at || dreamTeamData.updatedAt,
    };
};

const normalizePlayers = async (rawPlayers, formation) => {
    if (!Array.isArray(rawPlayers)) {
        return {
            error: "players must be an array",
        };
    }

    const slotMap = getFormationSlotMap(formation);

    if (rawPlayers.length > slotMap.size) {
        return {
            error: `players cannot be more than ${slotMap.size} for ${formation}`,
        };
    }

    const usedSlots = new Set();
    const usedPlayerIds = new Set();
    const normalizedPlayers = [];

    for (const rawPlayer of rawPlayers) {
        if (!rawPlayer || typeof rawPlayer !== "object") {
            return {
                error: "Each player must be an object",
            };
        }

        const slot = cleanText(rawPlayer.slot)?.toUpperCase();

        if (!slot || !slotMap.has(slot)) {
            return {
                error: `Invalid slot for ${formation}. Allowed slots: ${[...slotMap.keys()].join(", ")}`,
            };
        }

        if (usedSlots.has(slot)) {
            return {
                error: `Duplicate slot: ${slot}`,
            };
        }

        const apiPlayerId = getPositiveInteger(rawPlayer.api_player_id || rawPlayer.apiPlayerId);

        if (!apiPlayerId) {
            return {
                error: "api_player_id is required for each selected player",
            };
        }

        if (usedPlayerIds.has(apiPlayerId)) {
            return {
                error: `Duplicate player: ${apiPlayerId}`,
            };
        }

        usedSlots.add(slot);
        usedPlayerIds.add(apiPlayerId);

        normalizedPlayers.push({
            slot,
            position: slotMap.get(slot).position,
            api_player_id: apiPlayerId,
            name: cleanText(rawPlayer.name),
            photo: cleanText(rawPlayer.photo),
            nationality: cleanText(rawPlayer.nationality),
        });
    }

    if (normalizedPlayers.length === 0) {
        return {
            players: [],
        };
    }

    const dbPlayers = await Player.findAll({
        where: {
            api_player_id: {
                [Op.in]: normalizedPlayers.map((player) => player.api_player_id),
            },
        },
        attributes: [
            "api_player_id",
            "name",
            "photo",
            "nationality",
        ],
    });

    const dbPlayerMap = new Map(
        dbPlayers.map((player) => {
            const playerData = player.toJSON();
            return [playerData.api_player_id, playerData];
        }),
    );

    const players = normalizedPlayers.map((player) => {
        const dbPlayer = dbPlayerMap.get(player.api_player_id);

        if (!dbPlayer && !player.name) {
            return {
                ...player,
                missingName: true,
            };
        }

        return {
            slot: player.slot,
            position: player.position,
            api_player_id: player.api_player_id,
            name: dbPlayer?.name || player.name,
            photo: dbPlayer?.photo || player.photo,
            nationality: dbPlayer?.nationality || player.nationality,
        };
    });

    const playerMissingName = players.find((player) => player.missingName);

    if (playerMissingName) {
        return {
            error: `Player ${playerMissingName.api_player_id} was not found in database, so name is required`,
        };
    }

    return {
        players,
    };
};

const normalizeDreamTeamPayload = async (payload, currentDreamTeam = null) => {
    const requestedName = cleanText(payload.name);
    const name = requestedName || currentDreamTeam?.name || DEFAULT_NAME;

    if (name.length > 100) {
        return {
            error: "name cannot be more than 100 characters",
        };
    }

    const requestedFormation = cleanText(payload.formation)?.toUpperCase();
    const formation = requestedFormation || currentDreamTeam?.formation || DEFAULT_FORMATION;

    if (!FORMATIONS[formation]) {
        return {
            error: `Unsupported formation. Allowed formations: ${Object.keys(FORMATIONS).join(", ")}`,
        };
    }

    if (payload.players !== undefined && !Array.isArray(payload.players)) {
        return {
            error: "players must be an array",
        };
    }

    const formationChanged = currentDreamTeam
        && requestedFormation
        && requestedFormation !== currentDreamTeam.formation;
    const rawPlayers = Array.isArray(payload.players)
        ? payload.players
        : formationChanged
            ? []
            : currentDreamTeam?.players || [];
    const normalizedPlayers = await normalizePlayers(rawPlayers, formation);

    if (normalizedPlayers.error) {
        return {
            error: normalizedPlayers.error,
        };
    }

    return {
        values: {
            name,
            formation,
            players: normalizedPlayers.players,
        },
    };
};

const getMyDreamTeamService = async (userId) => {
    const dreamTeam = await DreamTeam.findOne({
        where: {
            user_id: userId,
        },
    });

    return formatDreamTeam(dreamTeam);
};

const saveMyDreamTeamService = async (userId, payload) => {
    const currentDreamTeam = await DreamTeam.findOne({
        where: {
            user_id: userId,
        },
    });

    const normalizedPayload = await normalizeDreamTeamPayload(payload, currentDreamTeam);

    if (normalizedPayload.error) {
        return {
            status: "invalid",
            message: normalizedPayload.error,
        };
    }

    if (!currentDreamTeam) {
        const dreamTeam = await DreamTeam.create({
            user_id: userId,
            ...normalizedPayload.values,
        });

        return {
            status: "success",
            created: true,
            dreamTeam: formatDreamTeam(dreamTeam),
        };
    }

    await currentDreamTeam.update(normalizedPayload.values);

    return {
        status: "success",
        created: false,
        dreamTeam: formatDreamTeam(currentDreamTeam),
    };
};

const updateDreamTeamService = async (userId, dreamTeamId, payload) => {
    const dreamTeam = await DreamTeam.findOne({
        where: {
            id: dreamTeamId,
            user_id: userId,
        },
    });

    if (!dreamTeam) {
        return {
            status: "not_found",
            message: "Dream team not found",
        };
    }

    const normalizedPayload = await normalizeDreamTeamPayload(payload, dreamTeam);

    if (normalizedPayload.error) {
        return {
            status: "invalid",
            message: normalizedPayload.error,
        };
    }

    await dreamTeam.update(normalizedPayload.values);

    return {
        status: "success",
        dreamTeam: formatDreamTeam(dreamTeam),
    };
};

const deleteDreamTeamService = async (userId, dreamTeamId) => {
    const deletedCount = await DreamTeam.destroy({
        where: {
            id: dreamTeamId,
            user_id: userId,
        },
    });

    return {
        status: deletedCount === 0 ? "not_found" : "success",
        message: deletedCount === 0 ? "Dream team not found" : "Dream team deleted successfully",
    };
};

export {
    deleteDreamTeamService,
    getDreamTeamFormationsService,
    getMyDreamTeamService,
    saveMyDreamTeamService,
    updateDreamTeamService,
};
