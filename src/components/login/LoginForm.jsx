import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "../login/login.css";

export function LoginForm ( { onSwitchToRegister, onSwitchToForgotPassword } ) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [messageError, setMensajeError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, error: errorContext } = useAuth();

    useEffect(() => {
        if (errorContext) {
            convertirError(errorContext);
        }
    }, [errorContext]);

    const convertirError = (error) => {
        // Manejar diferentes tipos de errores
        if (error === 404) {
            setMensajeError("Usuario no encontrado. Por favor, verifica tu correo electrónico.");
        } else if (error === 401) {
            setMensajeError("Contraseña incorrecta. Por favor, intenta nuevamente.");
        } else if (error === 403) {
            setMensajeError("Tu cuenta ha sido bloqueada. Por favor, contacta al administrador.");
        } else if (error === 500) {
            setMensajeError("Error del servidor. Por favor, intenta más tarde.");
        } else if (error === "invalid_session") {
            setMensajeError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        } else if (error === "network_error") {
            setMensajeError("Error de conexión. Por favor verifica tu internet e intenta nuevamente.");
        } else {
            setMensajeError("Error al iniciar sesión. Por favor, intenta nuevamente.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="dou-login-container">
            <form onSubmit={handleSubmit} className="dou-login-form">   
                <input
                    className="dou-login-input"
                    name="email"
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />

                <input 
                    className="dou-login-input"
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {messageError && (
                    <div className="dou-login-error" data-testid="error-message">
                        {messageError}
                    </div>
                )}
                
                <div className="dou-login-forgot-password-container">
                    <button 
                        className="dou-login-button-forgot-password"
                        type="button" 
                        onClick={onSwitchToForgotPassword}
                    >
                        Olvide mi contraseña
                    </button>
                </div>
                
                <button 
                    className="dou-login-button-submit"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Cargando..." : "Entrar"}
                </button>
                
                <p className="dou-login-register-text">
                    ¿No tienes una cuenta? 
                    <button 
                        className="dou-login-button-register"
                        type="button" 
                        onClick={onSwitchToRegister}
                    >
                        Regístrate
                    </button>
                </p>
            </form>
        </div>
    );
}
