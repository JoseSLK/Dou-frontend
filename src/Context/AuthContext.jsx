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
        const storedUser = localStorage.getItem("user");
        
        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser({
                    id: parsedUser.user_id,
                    email: parsedUser.user_email,
                    name: parsedUser.username,
                    role: parsedUser.user_role
                });
                setUserRole(parsedUser.user_role);
                setIsLoggedIn(true);
                navigate("/Dou-frontend/dashboard", {replace: true});
            } catch (error) {
                console.error('Error al cargar el usuario:', error);
                // Limpiar datos inválidos
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/Dou-frontend/login", {replace: true});
            }
        } else {
            navigate("/Dou-frontend/login", {replace: true});
        }
        setLoading(false);
    }, []);


    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
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
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }

            const data = await response.json();
            
            // Guardar en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Actualizar el estado
            setToken(data.token);
            setUser({
                id: data.user.user_id,
                email: data.user.user_email,
                name: data.user.username,
                role: data.user.user_role
            });
            setUserRole(data.user.user_role);
            setIsLoggedIn(true);
            
            // Navegar al dashboard
            navigate("/Dou-frontend/dashboard", {replace: true});
        } catch (error) {
            console.error('Error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
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