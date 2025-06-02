/**
 * Servicio que gestiona el material educativo (artículos y archivos adjuntos).
 * Permite crear, actualizar y eliminar material con sus archivos asociados.
 */
import { API_URL } from '../config/constants';

export const materialService = {
    createMaterial: async (descriptionFile, attachments) => {
        const formData = new FormData();
        formData.append("description", descriptionFile);
        
        attachments.forEach((file, index) => {
            formData.append(`file${index + 1}`, file);
        });

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/material/`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al crear el artículo");
        }

        return response.json();
    },

    updateMaterial: async (materialId, descriptionFile, attachments) => {
        const formData = new FormData();
        
        if (descriptionFile) {
            formData.append("description", descriptionFile);
        }
        
        attachments.forEach((file, index) => {
            formData.append(`file${index + 1}`, file);
        });

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/material/${materialId}`, {
            method: "PUT",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el artículo");
        }

        return response.json();
    },

    deleteMaterial: async (materialId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/material/${materialId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el artículo");
        }

        return response.json();
    }
};