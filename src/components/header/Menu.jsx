/**
 * @fileoverview Componente que maneja el menú de navegación de módulos de la aplicación.
 * Proporciona acceso rápido a las diferentes secciones (Contenido, Ejercicios).
 * 
 * @module Menu
 * @requires react
 * @requires react-router-dom
 */

import React, { useEffect, useRef } from "react";
import "../header/header.css";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Componente que renderiza el menú de navegación de módulos.
 * Incluye un botón de hamburguesa que despliega las opciones de navegación.
 * 
 * @component
 * @returns {JSX.Element} Menú de navegación con enlaces a las diferentes secciones
 */
export function LinkModules() {
    const [showOptions, setShowOptions] = useState(false);
    const [isDropdownVisible, setIsDropdownVisibleOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);
        
    useEffect( () => {
        if (showOptions) {
            setIsDropdownVisibleOpen(true);
        } else {
            const timer = setTimeout(() => {
                setIsDropdownVisibleOpen(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showOptions]);

    return (
        <div className="dou-strip" ref={dropdownRef}>
            <div
                className="dou-strip-button"
                onClick={() => setShowOptions(!showOptions)}
            >
                <div className="dou-menu-line"></div>
                <div className="dou-menu-line mid"></div>
                <div className="dou-menu-line"></div>
            </div>
            {isDropdownVisible && (
                <div className={`dou-strip-options ${showOptions? "open": ""}`}>
                    <Link to="/dashboard/education" className="dou-strip-option">Contenido</Link>
                    <Link to="/dashboard/contest" className="dou-strip-option">Contest</Link>
                    <Link to="/dashboard/exercises" className="dou-strip-option">Ejercicios</Link>
                </div>
            )}
        </div>
    );

}