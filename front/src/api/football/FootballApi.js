import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/football",
  headers: {
    "Content-Type": "application/json",
  },
});

const requestFootball = async (request) => {
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

export const getFixturesByDate = (date) => {
  return requestFootball(() => API.get(`/fixtures/date/${date}`));
};

export const getFixtureFeed = ({ from, to, limit = 40 } = {}) => {
  return requestFootball(() => API.get("/fixtures/feed", {
    params: {
      from,
      to,
      limit,
    },
  }));
};

export const getMatchById = (apiFixtureId) => {
  return requestFootball(() => API.get(`/matches/${apiFixtureId}`));
};

export const getTopMatch = () => {
  return requestFootball(() => API.get("/featured-fixtures"));
};

export const getLeagueStandings = ({ league, season }) => {
  return requestFootball(() => API.get(`/leagues/${league}/standings`, {
    params: {
      season,
    },
  }));
};

export const getTeamById = (apiTeamId) => {
  return requestFootball(() => API.get(`/teams/${apiTeamId}`));
};

export const getPlayerById = (apiPlayerId) => {
  return requestFootball(() => API.get(`/players/${apiPlayerId}`));
};

export const searchFootball = ({ search, type = "all", position }) => {
  return requestFootball(() => API.get("/search", {
    params: {
      search,
      type,
      position,
    },
  }));
};
