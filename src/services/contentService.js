/**
 * Servicio que gestiona el contenido educativo y material didáctico.
 * Maneja la obtención, búsqueda y procesamiento de artículos y sus adjuntos.
 */
import { API_URL } from '../config/constants';
import articleProcessor from "../utils/articleProcessor";

export const contentService = {
    getDefaultContent: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/material/onlyid`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al cargar el contenido");
        }

        const data = await response.json();
        return articleProcessor(data);
    },

    getArticleById: async (materialId) => {
        if (!materialId) return;

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/material/${materialId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al cargar el contenido");
        }

        const data = await response.json();
        let processedAttachments = [];

        if (data.attachments && data.attachments.length > 0) {
            processedAttachments = data.attachments.map(attachment => ({
                fileName: attachment.file_name,
                base64Content: attachment.base64_content,
                downloadUrl: `data:application/octet-stream;base64,${attachment.base64_content}`
            }));
        }

        return {
            article: data,
            attachments: processedAttachments
        };
    },

    searchArticles: async (searchTerm) => {
        if (!searchTerm || !searchTerm.trim()) {
            return [];
        }

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/material/search?q=${encodeURIComponent(searchTerm)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al cargar el contenido");
        }

        const data = await response.json();
        
        if (!data || data.length === 0) {
            return [];
        }

        return articleProcessor(data);
    }
};