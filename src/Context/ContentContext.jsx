/**
 * @fileoverview Contexto que gestiona el estado global del contenido educativo.
 * Maneja la carga, búsqueda y selección de artículos y materiales didácticos.
 * 
 * @module ContentContext
 * @requires react
 * @requires contentService
 */

import React, { useCallback, useContext, createContext, useState, useEffect, useMemo } from "react";
import { contentService } from '../services/contentService';

/**
 * Contexto que mantiene el estado del contenido educativo.
 * @type {React.Context}
 */
const ContentContext = createContext();

/**
 * Proveedor del contexto de contenido que maneja el estado global de los materiales educativos.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * @returns {JSX.Element} Proveedor del contexto de contenido
 */
export function ContentProvider({ children }) {
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [filesArticle, setFilesArticle] = useState(null);
    const [searchContent, setSearchContent] = useState([]);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Carga el contenido educativo por defecto.
     * 
     * @async
     * @callback
     * @returns {Promise<void>}
     * @throws {Error} Si hay un error al cargar el contenido
     */
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

    /**
     * Obtiene un artículo específico por su ID y sus archivos adjuntos.
     * 
     * @async
     * @callback
     * @param {string} materialId - ID del material a obtener
     * @returns {Promise<void>}
     * @throws {Error} Si hay un error al cargar el artículo
     */
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

    /**
     * Busca artículos basados en un término de búsqueda.
     * 
     * @async
     * @callback
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Promise<void>}
     * @throws {Error} Si hay un error en la búsqueda
     */
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

    /**
     * Selecciona un artículo para visualización.
     * 
     * @callback
     * @param {Object} article - Artículo a seleccionar
     */
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

/**
 * Hook personalizado para acceder al contexto de contenido.
 * 
 * @returns {Object} Contexto de contenido
 * @throws {Error} Si se usa fuera de un ContentProvider
 */
export function useContent() {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error("useContent must be used within a ContentProvider");
    }
    return context;
}