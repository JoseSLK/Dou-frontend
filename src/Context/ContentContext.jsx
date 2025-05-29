import React, { useCallback, useContext, createContext, useState, useEffect, useMemo } from "react";
import { contentService } from '../services/contentService';

const ContentContext = createContext();

export function ContentProvider({ children }) {
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [filesArticle, setFilesArticle] = useState(null);
    const [searchContent, setSearchContent] = useState([]);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadContent = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await contentService.getDefaultContent();
            setContent(data);
        } catch (err) {
            console.error("Error en loadContent:", err);
            setError(err.message || "Error al cargar el contenido");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchArticleById = useCallback(async (materialId) => {
        if (!materialId) return;

        setLoading(true);
        setError(null);

        try {
            const { article, attachments } = await contentService.getArticleById(materialId);
            setFilesArticle(attachments);
        } catch (err) {
            console.error("Error en fetchContentById:", err);
            setError(err.message || "Error al cargar el contenido");
            setFilesArticle([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchArticles = useCallback(async (searchTerm) => {
        if (!searchTerm || !searchTerm.trim()) {
            setSearchContent([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await contentService.searchArticles(searchTerm);
            setSearchContent(data);
        } catch (err) {
            console.error("Error en searchArticles:", err);
            setError(err.message || "Error al buscar artículos");
            setSearchContent([]);
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