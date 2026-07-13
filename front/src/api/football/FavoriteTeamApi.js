import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/favorites/teams",
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

const requestFavorite = async (request) => {
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

export const getFavoriteTeams = () => {
  return requestFavorite(() => API.get("/"));
};

export const addFavoriteTeam = (teamId) => {
  return requestFavorite(() => API.post(`/${teamId}`));
};

export const removeFavoriteTeam = (teamId) => {
  return requestFavorite(() => API.delete(`/${teamId}`));
};
