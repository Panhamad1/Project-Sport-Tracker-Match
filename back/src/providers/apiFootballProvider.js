import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const BASE_URL = process.env.API_FOOTBALL_BASE_URL || "https://v3.football.api-sports.io";

const apiFootballClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});
const apiFootballGet = async (endpoint, params = {}) =>{
    const apiKey = process.env.API_FOOTBALL_KEY;
    if(!apiKey){
        throw new Error("api key is missing");
    }
    try {
        const res = await apiFootballClient.get(endpoint, {
            params,
            headers: {
                "x-apisports-key": apiKey,
            },
        });
        const data = res.data;
        const errors = data.errors;
        const hasErrors = Array.isArray(errors) ? errors.length > 0 : errors && Object.keys(errors).length > 0;
        if(hasErrors){
            throw new Error(`API-FOOTBALL error: ${JSON.stringify(errors)}`);
        }
        return data;
    }catch (error){
        const message = error.response?.data?.message || error.response?.statusText || error.message;
        throw new Error(`Request API Failed: ${message}`);
    }
};
export { apiFootballGet } ;