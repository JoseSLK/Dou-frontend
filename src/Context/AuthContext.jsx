import React, { createContext, useState, useContext, useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";


const AuthContext = createContext();


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            setUser({
                id: "user.username",
                email: "user_email",
                name: "Federico",
            });
            navigate("/Dou-frontend/dashboard", {replace: true});
        } else {
            navigate("/Dou-frontend/login", {replace: true});
        }
        setLoading(false);
    }, []);


    const login = async (email, password) => {

        fetch('http://localhost:8080/auth/login', {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                user_password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setToken(data.token);
            setUser({
                "id": data.id,
                "username": data.username,
                "user_email": data.user_email,
                "user_role": data.user_role
            });

            setUserRole(data.user_role);
            setIsLoggedIn(true);

            navigate("/Dou-frontend/dashboard", {replace: true});
            setLoading(false);
        })
        .catch(error => console.error('Error:', error));
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setUserRole(null);
        isLoggedIn(false);
        
        navigate("/Dou-frontend/login", {replace: true});
    };

    
    const value = {
        user,
        token,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}