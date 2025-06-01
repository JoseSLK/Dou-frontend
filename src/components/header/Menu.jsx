import React, { useEffect, useRef } from "react";
import "../header/header.css";
import { useState } from "react";
import { Link } from "react-router-dom";

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
                    {/* <Link to="/constest" className="dou-strip-option">Contest</Link> */}
                    <Link to="/dashboard/exercises" className="dou-strip-option">Ejercicios</Link>
                </div>
            )}
        </div>
    );

}