import {login, register, getMe} from "../api/auth/AuthApi.js";

export async function loginUser(identifier, password){
    const data = await login(identifier, password);

    if(data.token){
        localStorage.setItem("token", data.token);
    }

    return data;
};

export async function registerUser(username, email, password){
    const data = await register(username, email, password);

    if(data.token){
        localStorage.setItem("token", data.token);
    }

    return data;
};


export async function fetchCurrentUser(){
    return await getMe();
};


export async function logoutUser(){
    localStorage.removeItem("token");
};