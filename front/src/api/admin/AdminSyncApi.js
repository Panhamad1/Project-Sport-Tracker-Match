import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api/admin/sync",
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

export const syncFixtures = ({ from, to }) => {
    return requestSync(() => API.post("/fixtures", {}, {
        params: { from, to },
    }));
};

export const syncFixture = ({ fixtureId }) => {
    return requestSync(() => API.post(`/fixtures/${fixtureId}`, {}));
};

export const syncTeams = ({ league, season }) => {
    return requestSync(() => API.post("/teams", {}, {
        params: { league, season },
    }));
};

export const syncPlayers = ({ teamApiId, season }) => {
    return requestSync(() => API.post("/players", {}, {
        params: { teamApiId, season },
    }));
};

export const syncPlayer = ({ playerApiId, season }) => {
    return requestSync(() => API.post(`/players/${playerApiId}`, {}, {
        params: { season },
    }));
};

export const syncStandings = ({ league, season }) => {
    return requestSync(() => API.post("/standings", {}, {
        params: { league, season },
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
