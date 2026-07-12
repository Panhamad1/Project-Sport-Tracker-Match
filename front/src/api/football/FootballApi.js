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

export const getMatchById = (apiFixtureId) => {
  return requestFootball(() => API.get(`/matches/${apiFixtureId}`));
};

export const searchFootball = ({ search, type = "all" }) => {
  return requestFootball(() => API.get("/search", {
    params: {
      search,
      type,
    },
  }));
};
