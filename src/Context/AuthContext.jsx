import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export const AuthContext = createContext();

const API_URL = "http://localhost:8080";


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
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

                    if (location.pathname === "/Dou-frontend/login") {
                            navigate("/Dou-frontend/dashboard", { replace: true });
                    }

                } catch (error) {
                    console.error('Error al cargar el usuario:', error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setError("Sesion expirada o inválida. Por favor, inicia sesión nuevamente.");

                    if (location.pathname !== "/Dou-frontend/login") {
                        navigate("/Dou-frontend/login", { replace: true });
                    }
                }
            }  else if (location.pathname !== "/Dou-frontend/login" && 
                       !location.pathname.includes("/public/") &&
                       !location.pathname.includes("/about") &&
                       !location.pathname.includes("/register") && 
                       !location.pathname.includes("/forgot-password")) {
                navigate("/Dou-frontend/login", { replace: true });
            }
            setLoading(false);
        };
        checkAuth();
    }, [navigate, location.pathname]);


    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
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
                setError(response.status);
                
                const error = new Error("Error de autenticación");
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            
            // Guardar en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setToken(data.token);
            setUser({
                id: data.user.user_id,
                email: data.user.user_email,
                name: data.user.username,
                role: data.user.user_role
            });
            setUserRole(data.user.user_role);
            setIsLoggedIn(true);
            setError(null);
            
            // Navegar al dashboard
            navigate("/Dou-frontend/dashboard", {replace: true});
            return data;
        } catch (error) {
            console.error("Error de inicio de sesión:", error);
            if (!error.status) {
                setError("network_error");
            }
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
        setIsLoggedIn(false);
        setError(null);
        
        navigate("/Dou-frontend/login", {replace: true});
    };

    
    const value = {
        user,
        token,
        loading,
        login,
        logout,
        error
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