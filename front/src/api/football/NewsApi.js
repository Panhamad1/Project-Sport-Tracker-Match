import axios from "axios";
import { buildApiUrl } from "../apiConfig.js";

const API = axios.create({
  baseURL: buildApiUrl("/api/news"),
  headers: {
    "Content-Type": "application/json",
  },
});

const requestNews = async (request) => {
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

export const getNewsArticles = ({ search = "", limit = 12 } = {}) => {
  return requestNews(() => API.get("/", {
    params: {
      search,
      limit,
    },
  }));
};
