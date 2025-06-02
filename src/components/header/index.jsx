/**
 * @fileoverview Componente que maneja la barra de navegación superior de la aplicación.
 * Incluye el logo, menú de navegación y funcionalidades de usuario (avatar, perfil, logout).
 * 
 * @module Header
 * @requires react
 * @requires react-router-dom
 */

import React, { useEffect, useRef } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useState } from "react";
import { LinkModules } from "./Menu";

/**
 * Componente principal de la barra de navegación.
 * Maneja la navegación, el estado de autenticación y el menú desplegable del usuario.
 * 
 * @component
 * @returns {JSX.Element} Barra de navegación con funcionalidades de usuario
 */
export function Header () {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if(isDropdownOpen) {
            setIsDropdownVisible(true);
        } else {
            const timer = setTimeout(() => {
                setIsDropdownVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isDropdownOpen])

    const handleAvatarClick = () => {
        setIsDropdownOpen(!isDropdownOpen); 
    };

    const handleLogout = async () => {
        await logout();
    }
    const handleProfileClick = () => {
        navigate("/dashboard/profile");
    }

    const handleMainClick = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (

        <div className={ user ? "dou-header logged":"dou-header"}>
            <button className="dou-main-button" onClick={handleMainClick}>
                DOU
            </button>
            <nav className={user ? "dou-header-nav dou-header-nav-logged" : "dou-header-nav"}>
                {user ? (
                    <>
                    <div className="user-menu" ref={dropdownRef}>
                        <div className="avatar-container">
                            <img
                                src="https://pbs.twimg.com/media/EV2PnO4WAAAj-_7?format=jpg&name=900x900"
                                alt="Avatar"
                                className="avatar"
                                onClick={handleAvatarClick}
                            />

                            {isDropdownVisible && (
                                <div className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
                                    <button onClick={handleLogout}>Cerrar sesión</button>
                                    <button onClick={handleProfileClick}>Perfil</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <LinkModules />
                    </>
                ) : (
                    <>
                        <Link to="/about" className="dou-header-button">Sobre nosotros</Link>
                    </>
                )}
            </nav>
            
        
        </div>
    );
}