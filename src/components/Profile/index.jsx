/**
 * @fileoverview Componente que maneja la visualización y gestión del perfil de usuario.
 * Incluye funcionalidades para editar perfil, cambiar contraseña y eliminar cuenta.
 * 
 * @module Profile
 * @requires react
 * @requires react-router-dom
 */

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { SubmissionList } from "../Exercise/view/SubmissionList";
import "./profile.css";
import { profileService } from '../../services/profileService';

/**
 * Modal para editar el perfil del usuario.
 * Permite actualizar el nombre de usuario y la contraseña.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Indica si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSave - Función para guardar los cambios
 * @param {string} props.username - Nombre de usuario actual
 * @returns {JSX.Element|null} Modal de edición de perfil o null si está cerrado
 */
const EditProfileModal = ({ isOpen, onClose, onSave, username }) => {
    const [formData, setFormData] = useState({
        username: username,
        currentPassword: "",
        newPassword: ""
    });
    const [error, setError] = useState("");
    const modalRef = useRef(null);

    // Actualizar formData cuando cambie username
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            username: username
        }));
    }, [username]);

    // Resetear el formulario cuando se cierra
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                username: username,
                currentPassword: "",
                newPassword: ""
            });
            setError("");
        }
    }, [isOpen, username]);

    // Manejar clic fuera del modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.currentPassword) {
            setError("Debes proporcionar tu contraseña actual");
            return;
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="dou-modal-overlay">
            <div className="dou-modal" ref={modalRef}>
                <h2>Editar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <div className="dou-form-group">
                        <label>Nuevo Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nuevo nombre de usuario"
                        />
                    </div>
                    <div className="dou-form-group">
                        <label>Contraseña Actual</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Contraseña actual"
                            required
                        />
                    </div>
                    <div className="dou-form-group">
                        <label>Nueva Contraseña</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Nueva contraseña (opcional)"
                        />
                    </div>
                    {error && <div className="dou-error">{error}</div>}
                    <div className="dou-modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Componente principal que maneja la visualización y gestión del perfil de usuario.
 * Muestra la información del usuario, sus envíos y proporciona opciones para
 * editar el perfil y eliminar la cuenta.
 * 
 * @component
 * @returns {JSX.Element} Vista del perfil de usuario
 */
export function Profile() {
    const { user, logout } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleEditProfile = async (formData) => {
        try {
            setMessage({ text: "", type: "" });
            const rolep = user.role == 'STUDENT'? 1 : 2;
            const bodyData = {
                username: formData.username,
                user_password: formData.currentPassword,
                user_email: user.email,
                user_role: rolep
            };

            const storedToken = localStorage.getItem("token");

            // Actualizar perfil
            await profileService.updateUserProfile(user.id, bodyData, storedToken);

            // Actualizar contraseña si se proporcionó una nueva
            if (formData.newPassword) {
                await profileService.updateUserPassword(
                    user.id,
                    {
                        current_password: formData.currentPassword,
                        new_password: formData.newPassword
                    },
                    storedToken
                );
                setMessage({
                    text: "Contraseña actualizada exitosamente",
                    type: "success"
                });
            }

            setMessage({
                text: "Perfil actualizado exitosamente",
                type: "success"
            });

            setIsEditModalOpen(false);
            await logout();
            window.location.reload();
        } catch (error) {
            setMessage({
                text: error.message,
                type: "error"
            });
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const storedToken = localStorage.getItem("token");
            await profileService.deleteUserAccount(user.id, storedToken);
            await logout();
        } catch (error) {
            setMessage({
                text: error.message,
                type: "error"
            });
        }
    };
    
    return (
        <div className="dou-profile">
            <div className="dou-profile__info">
                <div className="dou-profile__info__avatar">
                    <img src={user?.avatar || "https://pbs.twimg.com/media/EV2PnO4WAAAj-_7?format=jpg&name=900x900"} alt="Avatar" />
                </div>
                <div className="dou-profile__info__details">
                    <h2>{user?.name || "Usuario"}</h2>
                    <p>
                        {user?.role && <span>{user.role}</span>}
                        {user?.email && <span>{user.email}</span>}
                    </p>
                    {message.text && (
                        <div className={`dou-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                    <div className="dou-profile__actions">
                        <button 
                            className="dou-button dou-button--primary"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Editar Perfil
                        </button>
                        <button 
                            className="dou-button dou-button--danger"
                            onClick={handleDeleteAccount}
                        >
                            Eliminar Cuenta
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="dou-profile__submissions">
                <h3>Mis Envíos</h3>
                <SubmissionList />
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditProfile}
                username={user?.name || ""}
            />
        </div>
    );
}