/**
 * @fileoverview Componente que muestra el historial de envíos de un usuario.
 * Permite ver y expandir los detalles de cada envío realizado.
 * 
 * @module SubmissionList
 * @requires react
 * @requires submissionService
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import "./style/Submission.css";
import { useAuth } from "../../../Context/AuthContext";
import { submissionService } from '../../../services/submissionService';

/**
 * Hook personalizado para contar renderizados en desarrollo.
 * @private
 * @param {string} componentName - Nombre del componente
 * @returns {number} Contador de renderizados
 */
const useRenderCount = (componentName) => {
    const renderCount = useRef(0);
    
    if (process.env.NODE_ENV === 'development') {
        useEffect(() => {
            renderCount.current += 1;
            console.log(`${componentName} renderizado ${renderCount.current} veces`);
        });
    }
    
    return renderCount.current;
};

/**
 * Lista de envíos con funcionalidad de expansión para ver detalles.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.problemId] - ID del ejercicio para filtrar envíos
 * @returns {JSX.Element} Lista de envíos con detalles expandibles
 */
export function SubmissionList({ problemId }) {
    const [submissions, setSubmissions] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useRenderCount('SubmissionList');

    /**
     * Obtiene los envíos del usuario, filtrados por ejercicio si se especifica.
     * 
     * @async
     * @callback
     * @returns {Promise<void>}
     * @throws {Error} Si hay un error al obtener los envíos
     */
    const fetchSubmissions = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = problemId 
                ? await submissionService.getSubmissionAttempts(user.id, problemId)
                : await submissionService.getUserSubmissions(user.id);

            if (Array.isArray(data)) {
                setSubmissions(data);
            } else {
                setSubmissions(data ? [data] : []);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
            setError(error.message);
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    }, [user, problemId]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const toggleExpand = useCallback((id) => {
        setExpanded(expanded === id ? null : id);
    }, [expanded]);

    if (loading) {
        return <div>Loading submissions...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="submission-list">
            {submissions.length === 0 ? (
                <div className="dou-empty">No submissions found</div>
            ) : (
                submissions.map((submission) => (
                    <div key={submission.submission_id} className="submission-item">
                        <div 
                            className="submission-header" 
                            onClick={() => toggleExpand(submission.submission_id)}
                        >
                            <span>ID: {submission.submission_id}</span>
                            <span>User: {submission.user_id}</span>
                            <span>Problem: {submission.problem_id}</span>
                            <span>Status: {submission.submission_answer_code}</span>
                        </div>
                        {expanded === submission.submission_id && (
                            <pre className="submission-code">
                                {submission.submission_content}
                            </pre>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}