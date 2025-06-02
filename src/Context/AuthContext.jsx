/**
 * @fileoverview Contexto de autenticación que gestiona el estado global de la sesión de usuario.
 * Proporciona funcionalidades de login, logout y validación de tokens.
 * 
 * @module AuthContext
 * @requires react
 * @requires react-router-dom
 * @requires authService
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from '../services/authService';

/**
 * Contexto de autenticación que mantiene el estado de la sesión del usuario.
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Proveedor del contexto de autenticación que maneja el estado global de la sesión.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * @returns {JSX.Element} Proveedor del contexto de autenticación
 */
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

                    try {
                        await authService.validateToken(storedToken);

                        if (location.pathname === "/login") {
                            navigate("/dashboard", { replace: true });
                        }
                    } catch (error) {
                        setError("Sesión expirada o inválida. Por favor, inicia sesión nuevamente.");
                        logout();
                    }
                } catch (error) {
                    console.error('Error al cargar el usuario:', error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setError("Sesión expirada o inválida. Por favor, inicia sesión nuevamente.");

                    if (location.pathname !== "/login") {
                        navigate("/login", { replace: true });
                    }
                }
            } else if (location.pathname !== "/login" &&
                !location.pathname.includes("/public/") &&
                !location.pathname.includes("/about") &&
                !location.pathname.includes("/register") &&
                !location.pathname.includes("/forgot-password")) {
                navigate("/login", { replace: true });
            }
            setLoading(false);
        };
        checkAuth();
    }, [navigate, location.pathname]);

    /**
     * Inicia sesión en el sistema y actualiza el estado global.
     * 
     * @async
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} Datos del usuario autenticado
     * @throws {Error} Si hay un error en el proceso de autenticación
     */
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const data = await authService.login(email, password);

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

            navigate("/dashboard", { replace: true });
            return data;
        } catch (error) {
            console.error("Error de inicio de sesión:", error);
            setError(error.status || "network_error");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cierra la sesión del usuario y limpia el estado global.
     * Redirige al usuario a la página de login.
     */
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setUserRole(null);
        setIsLoggedIn(false);
        setError(null);

        navigate("/login", { replace: true });
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

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * 
 * @returns {Object} Contexto de autenticación
 * @throws {Error} Si se usa fuera de un AuthProvider
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}