import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/admin/featured-fixtures",
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

const requestFeaturedFixture = async (request) => {
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

export const selectTopMatch = ({ apiFixtureId, label = "Top Match" }) => {
  return requestFeaturedFixture(() => API.post(`/${apiFixtureId}`, {
    label,
  }));
};

