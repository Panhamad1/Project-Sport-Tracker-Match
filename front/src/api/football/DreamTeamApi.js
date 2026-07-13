import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/dream-team",
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

const requestDreamTeam = async (request) => {
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

export const getDreamTeamFormations = () => {
  return requestDreamTeam(() => API.get("/formations"));
};

export const getMyDreamTeam = () => {
  return requestDreamTeam(() => API.get("/me"));
};

export const saveDreamTeam = ({ name, formation, players }) => {
  return requestDreamTeam(() => API.post("/", {
    name,
    formation,
    players,
  }));
};

export const updateDreamTeam = ({ dreamTeamId, name, formation, players }) => {
  return requestDreamTeam(() => API.patch(`/${dreamTeamId}`, {
    name,
    formation,
    players,
  }));
};

export const deleteDreamTeam = ({ dreamTeamId }) => {
  return requestDreamTeam(() => API.delete(`/${dreamTeamId}`));
};
