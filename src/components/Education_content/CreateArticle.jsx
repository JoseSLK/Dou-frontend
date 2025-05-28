import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";

export function CreateArticle({ onClose }) {
    const { user } = useAuth();
    const [descriptionFile, setDescriptionFile] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Only show if user is PROFESSOR
    if (user?.role !== "PROFESSOR") {
        return null;
    }

    const handleDescriptionChange = (e) => {
        setDescriptionFile(e.target.files[0]);
    };

    const handleAttachmentsChange = (e) => {
        setAttachments(Array.from(e.target.files));
    };

    const handleCreate = async () => {
        if (!descriptionFile) {
            setError("El archivo de descripción es obligatorio");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", descriptionFile);
            
            attachments.forEach((file, index) => {
                formData.append(`file${index + 1}`, file);
            });

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/material/", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Error al crear el artículo");
            }

            setSuccess("Artículo creado exitosamente");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="dou-edit-article">
            <h2>Crear Nuevo Artículo</h2>
            
            <div className="form-group">
                <label>Archivo de descripción (TXT) *:</label>
                <input 
                    type="file" 
                    accept=".txt"
                    onChange={handleDescriptionChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Archivos adjuntos (opcional):</label>
                <input 
                    type="file" 
                    multiple
                    onChange={handleAttachmentsChange}
                />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="button-group">
                <button onClick={handleCreate} className="edit-button">
                    Crear
                </button>
                <button onClick={onClose} className="delete-button">
                    Cancelar
                </button>
            </div>
        </div>
    );
} 