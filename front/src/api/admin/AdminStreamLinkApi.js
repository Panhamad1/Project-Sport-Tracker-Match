import axios from "axios";
import { buildApiUrl } from "../apiConfig.js";

const API = axios.create({
  baseURL: buildApiUrl("/api/admin/stream-links"),
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

const requestStreamLink = async (request) => {
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

export const getMatchStreamLinks = ({ apiFixtureId }) => {
  return requestStreamLink(() => API.get(`/matches/${apiFixtureId}`));
};

export const addMatchStreamLink = ({ apiFixtureId, title, url, sourceName }) => {
  return requestStreamLink(() => API.post(`/matches/${apiFixtureId}`, {
    title,
    url,
    source_name: sourceName,
  }));
};

export const deleteStreamLink = ({ streamLinkId }) => {
  return requestStreamLink(() => API.delete(`/${streamLinkId}`));
};
