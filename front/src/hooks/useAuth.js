import { useState, useEffect } from "react";
import { fetchCurrentUser, logoutUser } from "../services/authService";

export function useAuth(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser(){
            const data = await fetchCurrentUser();

            if(!data.message){
                setUser(data);
            }

            setLoading(false);
        }

        loadUser();
    }, []);

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return {user, loading, logout};
}