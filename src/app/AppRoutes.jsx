/**
 * @fileoverview Configuración principal de rutas de la aplicación DOU.
 * Define y gestiona todas las rutas de la aplicación, incluyendo rutas públicas y protegidas.
 * Implementa un sistema de protección de rutas basado en autenticación.
 * 
 * @module AppRoutes
 * @requires react
 * @requires react-router-dom
 * @requires ../components/AppContainer
 * @requires ../components/Dashboard
 * @requires ../components/login/LoginForm
 * @requires ../components/login/RegisterForm
 * @requires ../components/login/ForgotPasswordForm
 * @requires ../Context/AuthContext
 * @requires ../components/Education_content
 * @requires ../components/about
 * @requires ../components/Exercise
 * @requires ../components/Exercise/view/ExerciseView
 * @requires ../components/Profile
 * @requires ../Context/ContentContext
 */

import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AppContainer } from "../components/AppContainer";
import { Dashboard } from "../components/Dashboard/index";
import { LoginForm } from "../components/login/LoginForm";
import { RegisterForm } from "../components/login/RegisterForm";
import { ForgotPasswordForm } from "../components/login/ForgotPasswordForm";
import { useAuth } from "../Context/AuthContext";
import { EducationContent } from "../components/Education_content";
import { About } from "../components/about";
import { Exercise } from "../components/Exercise";
import { Profile } from "../components/Profile";
import { ContentProvider } from "../Context/ContentContext";
import { ArenaCode } from "../components/ArenaCode";

/**
 * Componente que define y gestiona todas las rutas de la aplicación.
 * Incluye:
 * - Rutas públicas (login, registro, recuperación de contraseña)
 * - Rutas protegidas (dashboard, ejercicios, perfil)
 * - Sistema de redirección y protección de rutas
 * 
 * @component
 * @returns {JSX.Element} Configuración de rutas de la aplicación
 */
export function AppRoutes () {
    const navigate = useNavigate();

    /**
     * Componente de ruta protegida que verifica la autenticación del usuario.
     * Redirige al login si el usuario no está autenticado.
     * 
     * @component
     * @param {Object} props - Propiedades del componente
     * @param {React.ReactNode} props.children - Componentes hijos a renderizar si el usuario está autenticado
     * @returns {JSX.Element} Componente protegido o formulario de login
     */
    function ProtectedRoute({ children }) {
        const { user, loading } = useAuth();
        const navigate = useNavigate();
        if (loading) return <div>Cargando...</div>;
        return user ? children : <LoginForm onSwitchToRegister={() => navigate("/register")} onSwitchToForgotPassword={() => navigate("/forgot-password")} />;
    }
    
    return (
        <AppContainer>
            <Routes>
                {/* Rutas públicas - Acceso sin autenticación */}
                <Route
                    path="/login"
                    element={
                        <LoginForm
                            onSwitchToRegister={() => navigate("/register")}
                            onSwitchToForgotPassword={() => navigate("/forgot-password")}
                        />
                    }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route
                    path="/register"
                    element={<RegisterForm onSwitchToLogin={() => navigate("/login")} />}
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordForm onSwitchToLogin={() => navigate("/login")} />}
                />
                
                {/* Rutas protegidas - Requieren autenticación */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                    {/* Subrutas del dashboard */}
                    <Route path="education" element={<ContentProvider><EducationContent/></ContentProvider>} />
                    <Route path="education/:contentId" element={<ContentProvider><EducationContent initialTab="search" /></ContentProvider>} />
                    <Route path="exercises" element={<Exercise />}/>
                    <Route path="exercises/search" element={<Exercise initialTab="search" />} />
                    <Route path="exercises/create" element={<Exercise initialTab="create" />} />
                    <Route path="exercises/:problemId" element={<Exercise initialTab="search" />} />
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="contest" element={<ArenaCode />} />
                </Route>

                {/* Ruta pública adicional */}
                <Route path="/about" element={<About />} />
                
                {/* Ruta 404 - Página no encontrada */}
                <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            </Routes>
        </AppContainer>
    );
}