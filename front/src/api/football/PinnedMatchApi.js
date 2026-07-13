import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/pinned/matches",
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

const requestPinnedMatch = async (request) => {
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

export const getPinnedMatches = () => {
  return requestPinnedMatch(() => API.get("/"));
};

export const pinMatch = ({ apiFixtureId }) => {
  return requestPinnedMatch(() => API.post(`/${apiFixtureId}`));
};

export const unpinMatch = ({ apiFixtureId }) => {
  return requestPinnedMatch(() => API.delete(`/${apiFixtureId}`));
};
