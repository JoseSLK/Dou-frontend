/**
 * @fileoverview Formulario de registro con validación de contraseñas y manejo de errores.
 * Incluye validación de requisitos de contraseña y verificación de disponibilidad de datos.
 * 
 * @module RegisterForm
 * @requires react
 * @requires authService
 */

import React, { useState } from "react";
import { BackIcon } from "../dou_icons/BackIcon";
import "../login/login.css";
import { DynamicText } from "../DynamicText";
import { authService } from "../../services/authService";

/**
 * Formulario de registro con validación de datos y retroalimentación visual.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSwitchToLogin - Función para volver al login
 * @returns {JSX.Element} Formulario de registro con validaciones
 */
export function RegisterForm({ onSwitchToLogin }) {
    const [user_email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const phrases = ["Bienvenido a DOU", "Gracias por el registro", "Esperamos que lo disfrutes"];

    /**
     * Maneja el envío del formulario de registro.
     * Valida contraseñas y maneja errores de registro.
     * 
     * @async
     * @param {Event} e - Evento de envío del formulario
     * @throws {Error} Si hay un error en el proceso de registro
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const user_password = e.target.password.value;
        const password2 = e.target.password2.value;
        const username = e.target.nickname.value;

        // Validación del dominio del correo
        if (!user_email.endsWith('@uptc.edu.co')) {
            setError("El correo electrónico debe ser del dominio @uptc.edu.co");
            setLoading(false);
            return;
        }

        if (user_password !== password2) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        try {
            const userData = {
                user_email,
                user_password,
                username
            };
            
            const response = await authService.register(userData);
            
            if (response.status === 201) {
                setSuccess("¡Registro exitoso! Redirigiendo al login...");
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            }
        } catch (error) {
            switch (error.status) {
                case 400:
                    setError("La contraseña debe tener: 8+ caracteres, 1 mayúscula, 1 minúscula y 1 carácter especial (@#-&?!)");
                    break;
                case 409:
                    setError("El correo electrónico o apodo ya está en uso, por favor intente con otro");
                    break;
                case 500:
                    setError("Error en el servidor. Por favor, intenta más tarde");
                    break;
                case 0:
                    setError(error.message);
                    break;
                default:
                    setError("Error inesperado. Por favor, intenta nuevamente");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dou-login-container">
            <button className="dou-back-login" onClick={onSwitchToLogin}><BackIcon className="dou-back-icon" /></button>
            <DynamicText phrases={phrases} />
            <form onSubmit={handleSubmit} className="dou-login-form register">
                {error && <div className="dou-login-error">{error}</div>}
                {success && <div className="dou-login-success">{success}</div>}
                <input 
                    type="email"
                    className="dou-login-input"
                    name="email"
                    placeholder="Email"
                    value={user_email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <div className="dou-form-row">
                    <input 
                        type="password"
                        name="password"
                        className="dou-login-input password"
                        placeholder="Contrasena"
                        required
                    />
                    <input 
                        type="password"
                        name="password2"
                        className="dou-login-input password"
                        placeholder="Confirma Contrasena"
                        required
                    />
                </div>
                
                <input 
                    type="text"
                    name="nickname"
                    className="dou-login-input"
                    placeholder="Apodo"
                    required
                />

                <button 
                    className="dou-login-button-submit"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Registrando..." : "Registrarme!!"}
                </button>
            </form>
        </div>
    );
}
