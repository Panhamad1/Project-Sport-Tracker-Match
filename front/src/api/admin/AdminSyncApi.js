import axios from "axios";
import { buildApiUrl } from "../apiConfig.js";

const API = axios.create({
    baseURL: buildApiUrl("/api/admin/sync"),
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const requestSync = async (request) => {
    try{
        const res = await request();

        return {
            ok: true,
            status: res.status,
            data: res.data,
        };
    }catch(error){
        return {
            ok: false,
            status: error.response?.status || "NETWORK",
            data: error.response?.data || { message: error.message || "Server error" },
        };
    }
};

const cleanParams = (params) => {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined && value !== false)
    );
};

export const syncFixtures = ({ from, to }) => {
    return requestSync(() => API.post("/fixtures", {}, {
        params: cleanParams({ from, to }),
    }));
};

export const syncFixture = ({ fixtureId }) => {
    return requestSync(() => API.post(`/fixtures/${fixtureId}`, {}));
};

export const syncTeams = ({ league, season }) => {
    return requestSync(() => API.post("/teams", {}, {
        params: cleanParams({ league, season }),
    }));
};

export const syncPlayers = ({ teamApiId, season, allSeasons }) => {
    return requestSync(() => API.post("/players", {}, {
        params: cleanParams({ teamApiId, season, allSeasons }),
    }));
};

export const syncPlayer = ({ playerApiId, season, allSeasons }) => {
    return requestSync(() => API.post(`/players/${playerApiId}`, {}, {
        params: cleanParams({ season, allSeasons }),
    }));
};

export const syncStandings = ({ league, season }) => {
    return requestSync(() => API.post("/standings", {}, {
        params: cleanParams({ league, season }),
    }));
};

export const syncMatchDetails = ({ matchId }) => {
    return requestSync(() => API.post(`/matches/${matchId}/details`, {}));
};

export const syncMatchDetailsByDate = ({ date }) => {
    return requestSync(() => API.post(`/matches/details/date/${date}`, {}));
};

export const loadFixturesByDate = ({ date }) => {
    return requestSync(() => API.get(`/fixtures/date/${date}`));
};
