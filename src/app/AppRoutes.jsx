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
import { ExerciseView } from "../components/Exercise/view/ExerciseView";
import { Profile } from "../components/Profile";
import { ContentProvider } from "../Context/ContentContext";

export function AppRoutes () {
    const navigate = useNavigate();


    function ProtectedRoute({ children }) {
        const { user, loading } = useAuth();
        const navigate = useNavigate();
        if (loading) return <div>Cargando...</div>;
        return user ? children : <LoginForm onSwitchToRegister={() => navigate("/register")} onSwitchToForgotPassword={() => navigate("/forgot-password")} />;
    }
    
    return (
        <AppContainer>
            <Routes>
                {/* Antes del login */}
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
                
                {/* Luego del login */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                    <Route path="education" element={<ContentProvider><EducationContent/></ContentProvider>} />
                    <Route path="education/:contentId" element={<ContentProvider><EducationContent initialTab="search" /></ContentProvider>} />
                    <Route path="exercises" element={<Exercise />}/>
                    <Route path="exercises/search" element={<Exercise initialTab="search" />} />
                    <Route path="exercises/create" element={<Exercise initialTab="create" />} />
                    <Route path="exercises/:problemId" element={<Exercise initialTab="search" />} />
                    <Route path="profile" element={<Profile/>}/>
                </Route>

                <Route path="/about" element={<About />} />
                
                <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            </Routes>
        </AppContainer>
    );
}