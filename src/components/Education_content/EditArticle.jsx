import React, { useState } from "react";
import { useContent } from "../../Context/ContentContext";
import { useAuth } from "../../Context/AuthContext";

export function EditArticle({ article, onClose }) {
    const { user } = useAuth();
    const { filesArticle } = useContent();
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

    const handleEdit = async () => {
        try {
            const formData = new FormData();
            
            if (descriptionFile) {
                formData.append("description", descriptionFile);
            }
            
            attachments.forEach((file, index) => {
                formData.append(`file${index + 1}`, file);
            });

            const response = await fetch(`http://localhost:8080/material/${article.material_id}`, {
                method: "PUT",
                body: formData,
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el artículo");
            }

            setSuccess("Artículo actualizado exitosamente");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/material/${article.material_id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el artículo");
            }

            setSuccess("Artículo eliminado exitosamente");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="dou-edit-article">
            <h2>Editar Artículo</h2>
            
            <div className="form-group">
                <label>Archivo de descripción (TXT):</label>
                <input 
                    type="file" 
                    accept=".txt"
                    onChange={handleDescriptionChange}
                />
            </div>

            <div className="form-group">
                <label>Archivos adjuntos:</label>
                <input 
                    type="file" 
                    multiple
                    onChange={handleAttachmentsChange}
                />
            </div>

            {filesArticle && filesArticle.length > 0 && (
                <div className="current-files">
                    <h3>Archivos adjuntos actuales:</h3>
                    <ul>
                        {filesArticle.map((file, index) => (
                            <li key={index}>{file.fileName}</li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="button-group">
                <button onClick={handleEdit} className="edit-button">
                    Editar
                </button>
                <button onClick={handleDelete} className="delete-button">
                    Eliminar
                </button>
                <button onClick={onClose} className="cancel-button">
                    Cancelar
                </button>
            </div>
        </div>
    );
} 