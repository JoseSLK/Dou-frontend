import React, { useCallback, useContext, createContext, useState, useEffect, useMemo } from "react";
import articleProcessor from "../utils/articleProcessor";

const ContentContext = createContext();

const API_URL = "http://localhost:8080";

export function ContentProvider({ children }) {
    const [selectedMaterial, setSelectedMaterial] = useState(null); //Este es el articulo seleccionado actualmente
    const [filesArticle, setFilesArticle] = useState(null); //Aqui guardo los archivos adjuntos del articulo selleccionado
    const [searchContent, setSearchContent] = useState([]); //Guarda la lista de respuestas de la busqueda
    const [content, setContent] = useState(null); //Guarda de los articulos por defecto
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Carga de contenido por defecto, para mostrar algo al principio
    const loadContent = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/material/onlyid`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if(!response.ok) {
                throw new Error("Error al cargar el contenido");
            }

            const data = await response.json();

            setContent(articleProcessor(data));
            setLoading(false);
        } catch (err) {
            console.error("Error en loadContent:", err);
            setError(err.message || "Error al cargar el contenido");
            setLoading(false);
        }
    }, []);

    const fetchArticleById = useCallback(async (materialId) => {
        if (!materialId) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/material/${materialId}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if( !response.ok ) {
                throw new Error("Error al cargar el contenido");                  
            }

            const data = await response.json();

            // Proceso los archivos adjuntos
            setFilesArticle([])
            if (data.attachments && data.attachments.length > 0) {
                const processedAttachments = data.attachments.map(attachment => ({
                    fileName: attachment.file_name,
                    base64Content: attachment.base64_content,
                    // Creando URL for easy download
                    downloadUrl: `data:application/octet-stream;base64,${attachment.base64_content}`
                }));
                setFilesArticle(processedAttachments);
            } else {
                setFilesArticle([]);
            }

            setLoading(false);
        }catch (err) {
            console.error("Error en fetchContentById:", err);
            setError(err.message || "Error al cargar el contenido");
            setLoading(false);
        }
    }, []);
    const searchArticles = useCallback(async (searchTerm) => {
        if (!searchTerm || !searchTerm.trim()) {
            setSearchContent([]); // Limpiar resultados si no hay término
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/material/search?q=${encodeURIComponent(searchTerm)}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if(!response.ok) {
                throw new Error("Error al cargar el contenido");
            }

            const data = await response.json();
            
            // Si no hay resultados, retornamos sin actualizar nada
            if (!data || data.length === 0) {
                setSearchContent([]);
                setLoading(false);
                return;
            }

            // Procesamos los artículos y los guardamos en selectedMaterial en lugar de content
            setSearchContent(articleProcessor(data));
        } catch (err) {
            console.error("Error en searchArticles:", err);
            setError(err.message || "Error al buscar artículos");
        } finally { 
            setLoading(false);
        }
    }, []);

    const selectArticle = useCallback((article) => {
        setSelectedMaterial(article);
    }, []);
    
    useEffect(() => {
        loadContent();
    }, [loadContent]);

    const value = useMemo(() => ({
        content,
        loading,
        error,
        selectedMaterial,
        setSelectedMaterial,
        loadContent,
        fetchArticleById,
        searchArticles,
        selectArticle,
        searchContent,
        filesArticle
    }), [content, loading, error, selectedMaterial,setSelectedMaterial, loadContent, fetchArticleById, searchArticles, selectArticle, searchContent, filesArticle]);
    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error("useContent must be used within a ContentProvider");
    }
    return context;
}