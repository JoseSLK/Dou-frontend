import React from "react";
import { Outlet, useMatch } from "react-router-dom";
import "./dashboard.css";
import { useAuth } from "../../Context/AuthContext";

export function Dashboard () {
    const { user } = useAuth();
    const isExactDashboard = useMatch({path: "/dashboard", end: true});

    return (
        <>
            {user ? (
                <div className="dou-dashboard">
                    {isExactDashboard && (
                        <div className="dou-dashboard-content">
                            <div className="section">
                                <h1>👋 Bienvenido <span>{user.name}</span> a tu espacio de aprendizaje DOUCODE</h1>
                                <p className="intro-text">
                                    Esta plataforma está diseñada para ayudarte a convertirte en un mejor programador a través de la práctica, el reto y la comunidad. Aquí aprenderás resolviendo problemas reales, participando en competencias y reforzando tu pensamiento lógico.
                                </p>
                                </div>

                                <div className="section">
                                <h2>🎯 Nuestro propósito</h2>
                                <p className="intro-text">
                                    Fomentar el pensamiento computacional, el trabajo autónomo y el dominio de estructuras y algoritmos fundamentales en la ciencia de la computación. La programación competitiva no solo mejora tus habilidades técnicas, sino que te prepara para entrevistas, proyectos y situaciones reales donde resolver problemas es esencial.
                                </p>
                                </div>

                                <div className="section">
                                <h2>🔍 ¿Qué puedes hacer aquí?</h2>
                                <div className="features">
                                    <div className="feature-card">
                                    <h3>Resolver ejercicios</h3>
                                    <p>Desde los más básicos hasta problemas desafiantes con tiempo límite.</p>
                                    </div>
                                    <div className="feature-card">
                                    <h3>Aprender con artículos</h3>
                                    <p>Explora guías y recursos teóricos creados por docentes y mentores.</p>
                                    </div>
                                    <div className="feature-card">
                                    <h3>Participar en torneos</h3>
                                    <p>Compite en eventos internos y mide tu progreso con otros estudiantes.</p>
                                    </div>
                                    <div className="feature-card">
                                    <h3>Ganar experiencia</h3>
                                    <p>Prepara tu mente para retos técnicos, exámenes y entrevistas laborales.</p>
                                    </div>
                                </div>
                                </div>

                                <div className="section" style={{textAlign: "center"}}>
                                <h2>🚀 ¿Listo para empezar?</h2>
                                <p>Comienza resolviendo tu primer ejercicio o explorando los recursos disponibles.</p>
                                <a href="#empezar" className="start-btn">Empezar ahora</a>
                                </div>

                                <div className="quote">“No se trata de cuántas veces fallas, sino de cuántas veces puedes resolver un problema mejor que ayer.”</div>

                                <div className="uptc">
                                Plataforma académica desarrollada en la <span>Universidad Pedagógica y Tecnológica de Colombia (UPTC)</span>
                                </div>
                            </div>
                    )}
                    
                    <Outlet />
                </div>
            ) : (
                <h1>Error al cargar el dashboard</h1>
            )}
        </>
    );
}