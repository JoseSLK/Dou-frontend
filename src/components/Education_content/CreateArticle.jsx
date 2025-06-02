/**
 * @fileoverview Componente que maneja la creación de nuevos artículos educativos.
 * Permite subir archivos de contenido y adjuntos.
 * 
 * @module CreateArticle
 * @requires react
 * @requires react-router-dom
 */

import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { materialService } from '../../services/materialService';

/**
 * Componente que proporciona un formulario para crear nuevos artículos educativos.
 * Permite subir un archivo principal de contenido y archivos adjuntos opcionales.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onClose - Función para cerrar el formulario de creación
 * @returns {JSX.Element} Formulario de creación de artículos
 */
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
            await materialService.createMaterial(descriptionFile, attachments);
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
                <div className="help-text">
                    <p>Para insertar videos de YouTube, usa el siguiente formato en tu archivo .txt:</p>
                    <div className="code-example">
                        <code>{`<iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/ID_DEL_VIDEO" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>`}</code>
                    </div>
                    <p>Reemplaza "ID_DEL_VIDEO" con el ID del video de YouTube (la parte después de v= en la URL).</p>
                </div>
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