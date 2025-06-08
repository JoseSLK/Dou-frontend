/**
 * @fileoverview Componente raíz de la UI de la aplicación DOU.
 * Configura el enrutador principal (React Router) y los proveedores de contexto globales.
 * Incluye efectos visuales (meteoros animados) y la estructura base de la aplicación.
 * Este componente es responsable de la disposición general y el estado global de la aplicación.
 * 
 * @module AppUI
 * @requires react
 * @requires react-router-dom
 * @requires ../components/header
 * @requires ./meteor.css
 * @requires ./index.css
 * @requires ./AppRoutes
 * @requires ../Context/AuthContext
 */

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "../components/header";
import "./meteor.css";
import "./index.css";
import { AppRoutes } from "./AppRoutes";
import { AuthProvider } from "../Context/AuthContext";

/**
 * Componente raíz de la UI que configura la estructura base de la aplicación.
 * Incluye:
 * - Router principal con ruta base '/'
 * - Proveedor de autenticación (AuthProvider)
 * - Efectos visuales de meteoros
 * - Header de navegación
 * - Sistema de rutas (AppRoutes)
 * 
 * @component
 * @returns {JSX.Element} Estructura base de la aplicación con enrutamiento y efectos visuales
 */
export function AppUI () {
    return (
        <Router basename="/">
            <AuthProvider>
                <div className="app">
                    {/* Efecto visual de estrella */}
                    <div className="star" id="position"></div>
                    
                    {/* Efectos visuales de meteoros */}
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className={`meteor-${index + 1}`}></div>
                    ))}
                    
                    <Header />
                    <AppRoutes />
                </div>
            </AuthProvider>
        </Router>
    )
}
