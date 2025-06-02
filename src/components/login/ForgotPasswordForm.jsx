/**
 * @fileoverview Componente temporal para la recuperación de contraseña.
 * Muestra un mensaje informativo mientras la funcionalidad está en desarrollo.
 * 
 * @module ForgotPasswordForm
 * @requires react
 */

import React from "react";
import { BackIcon } from "../dou_icons/BackIcon";
import "../login/login.css";

/**
 * Formulario temporal para recuperación de contraseña.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSwitchToLogin - Función para volver al login
 * @returns {JSX.Element} Mensaje informativo con botón de retorno
 */
export function ForgotPasswordForm ({ onSwitchToLogin }) {
    return (
        <div className="dou-login-container">
        <div className="dou-login-form-forgot-password">
            <button className="dou-back-login" onClick={ onSwitchToLogin }><BackIcon  className="dou-back-icon"/></button>
            <h2>Si has perdido tu contrasena, por favor contacta al administrador. Aun no tenemos esta funcion directa disponible</h2>
        </div>
            
        </div>
    );
}
