import axios from "axios";
import { buildApiUrl } from "../apiConfig.js";

const API = axios.create({
  baseURL: buildApiUrl("/api/leaderboard"),
  headers: {
    "Content-Type": "application/json",
  },
});

const requestLeaderboard = async (request) => {
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

export const getLeaderboard = ({ limit = 50 } = {}) => {
  return requestLeaderboard(() => API.get("/", {
    params: {
      limit,
    },
  }));
};
