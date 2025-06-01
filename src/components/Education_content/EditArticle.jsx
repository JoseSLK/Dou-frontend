import React, { useState } from "react";
import { useContent } from "../../Context/ContentContext";
import { useAuth } from "../../Context/AuthContext";
import { materialService } from '../../services/materialService';
import { useNavigate } from "react-router-dom";

export function EditArticle({ article, onClose }) {
    const { user } = useAuth();
    const { filesArticle, setSelectedMaterial } = useContent();
    const navigate = useNavigate();
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
            await materialService.updateMaterial(article.material_id, descriptionFile, attachments);
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
            await materialService.deleteMaterial(article.material_id);
            setSuccess("Artículo eliminado exitosamente");
            
            // Limpiar el estado antes de navegar
            setSelectedMaterial(null);
            
            // Esperar un momento para que el usuario vea el mensaje de éxito
            setTimeout(() => {
                // Navegar a la ruta base de educación
                navigate('/dashboard/education', { replace: true });
                // Cerrar el modo edición
                onClose();
            }, 1000);
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