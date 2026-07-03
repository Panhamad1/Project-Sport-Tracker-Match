import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api/auth",
    headers: {
        "Content-Type": "application/json"
    }
});


API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export async function login(identifier, password){  
    try{
        const res = await API.post("/login", {identifier, password});
        return res.data;
    }catch(error){
        return error.response?.data || {message: "Server error"};
    }
};


export async function register(username, email, password){
    try{
        const res = await API.post("/register", {username, email, password});
        return res.data;
    }catch(error){
        return error.response?.data || {message: "Server error"};
    }
};


export async function getMe() {
  try {
    const res = await API.get("/me");
    return res.data;
  } catch (error) {
    return error.response?.data || { message: "Unauthorized" };
  }
};