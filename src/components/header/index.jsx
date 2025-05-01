import React, { useEffect, useRef } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useState } from "react";
import { LinkModules } from "./Menu";

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
        navigate("/Dou-frontend/login");
    }
    const handleProfileClick = () => {
        navigate("/Dou-frontend/dashboard/profile");
    }

    const handleMainClick = () => {
        window.location.reload();
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
                        <Link to="/Dou-frontend/about" className="dou-header-button">Sobre nosotros</Link>
                    </>
                )}
            </nav>
            
        
        </div>
    );
}