import React from "react";

export function ForgotPasswordForm ({ onSwitchToLogin }) {
    return (
        <>
        <div className="dou-login-form-forgot-password">
            <button className="dou-back-login" onClick={ onSwitchToLogin }>Atrás</button>
            <h2>Si has perdido tu contrasena, por favor contacta al administrador. Aun no tenemos esta funcion directa disponible</h2>
        </div>
            
        </>
    );
}
