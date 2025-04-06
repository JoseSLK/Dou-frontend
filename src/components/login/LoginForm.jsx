import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "../login/login.css";

export function LoginForm ( { onSwitchToRegister, onSwitchToForgotPassword } ) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const password = e.target.password.value;

        setLoading(true);
        try {
            await login(email, password);
            setError("");
        } catch (err) {
            setError(err.message || "Error al iniciar sesión");
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
                    onChange={(e) => {setEmail(e.target.value)}} 
                    required 
                />

                <input 
                    className="dou-login-input"
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                />
                
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
                >
                    Entrar
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
