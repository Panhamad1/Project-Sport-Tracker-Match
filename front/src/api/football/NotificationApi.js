import axios from "axios";
import { buildApiUrl } from "../apiConfig.js";

const API = axios.create({
  baseURL: buildApiUrl("/api/notifications"),
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

const requestNotification = async (request) => {
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

export const getNotifications = () => {
  return requestNotification(() => API.get("/"));
};

export const markNotificationRead = ({ notificationId }) => {
  return requestNotification(() => API.patch(`/${notificationId}/read`));
};

export const markAllNotificationsRead = () => {
  return requestNotification(() => API.patch("/read-all"));
};
