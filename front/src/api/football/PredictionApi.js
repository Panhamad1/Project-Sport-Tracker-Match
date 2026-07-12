import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/predictions",
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

const requestPrediction = async (request) => {
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

export const getPredictionOptions = ({ apiFixtureId }) => {
  return requestPrediction(() => API.get(`/matches/${apiFixtureId}/options`));
};

export const getMyPredictions = () => {
  return requestPrediction(() => API.get("/me"));
};

export const savePredictionPick = ({ apiFixtureId, fixtureOddId }) => {
  return requestPrediction(() => API.post(`/matches/${apiFixtureId}/picks`, {
    fixture_odd_id: fixtureOddId,
  }));
};

export const deletePredictionPick = ({ predictionPickId }) => {
  return requestPrediction(() => API.delete(`/picks/${predictionPickId}`));
};
