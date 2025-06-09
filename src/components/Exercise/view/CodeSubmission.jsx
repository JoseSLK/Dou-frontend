/**
 * @fileoverview Componente para la presentación de soluciones de código.
 * Maneja la edición, envío y retroalimentación de soluciones de ejercicios.
 * 
 * @module CodeSubmission
 * @requires react
 * @requires submissionService
 */

import React, { useState, useCallback, useMemo } from "react";
import "./style/Submission.css";
import { useAuth } from "../../../Context/AuthContext";
import { submissionService } from '../../../services/submissionService';

/**
 * Componente que gestiona la presentación de soluciones de código.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.problemId - ID del ejercicio al que se presenta la solución
 * @param {Function} [props.onSubmit] - Callback que se ejecuta cuando se envía una solución
 * @param {Function} [props.onVerdict] - Callback que se ejecuta cuando se recibe un veredicto
 * @returns {JSX.Element} Editor de código con opciones de envío
 */
export function CodeSubmission({ problemId, onSubmit, onVerdict }) {
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [code, setCode] = useState("");
    const [file, setFile] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const { user } = useAuth();

    const programmingLanguages = useMemo(() => [
        { value: "cpp", label: "C++" },
        { value: "java", label: "Java" },
        { value: "python", label: "Python" },
        { value: "node", label: "node" },
    ], []);

    const handleLanguageChange = useCallback((e) => {
        setSelectedLanguage(e.target.value);
    }, []);

    const handleCodeChange = useCallback((e) => {
        setCode(e.target.value);
    }, []);

    const handleFileUpload = useCallback((e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
    }, []);

    /**
     * Maneja el envío de la solución, ya sea desde el editor o archivo.
     * 
     * @async
     * @callback
     * @param {Event} e - Evento de envío
     * @throws {Error} Si hay un error en el envío o la conexión
     */
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!user?.id || !problemId) {
            setSubmissionStatus("Error: User or problem ID missing");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("problem_id", problemId);
        formData.append("lang", selectedLanguage);

        if (file) {
            formData.append("source", file);
        } else if (code && code.trim() !== "") {
            const blob = new Blob([code], { type: "text/plain" });
            const filename = `${problemId}.${selectedLanguage}.txt`;
            formData.append("source", blob, filename);
        } else {
            setSubmissionStatus("Please provide code or upload a file.");
            return;
        }

        try {
            setSubmissionStatus("Submitting...");
            
            // Notificar que se está enviando la solución (para WebSocket)
            if (onSubmit) {
                console.log('Notificando envío de solución via WebSocket');
                onSubmit(problemId);
            }
            
            const responseData = await submissionService.submitCode(formData);
            
            // Notificar el veredicto recibido (para WebSocket)
            if (onVerdict) {
                console.log('Notificando veredicto via WebSocket:', responseData.veredict);
                onVerdict(responseData.veredict, responseData);
            }
            
            switch (responseData.veredict) {
                case "AC":
                    setSubmissionStatus("Accepted! Your solution is correct.");
                    break;
                case "CE":
                    setSubmissionStatus("Compile Error: Please check your code syntax.");
                    break;
                default:
                    setSubmissionStatus(`Submission received. Veredict: ${responseData.veredict}`);
            }
            
            setCode("");
            setFile(null);
        } catch (error) {
            console.error("Submission error:", error.message);
            setSubmissionStatus("Error: Could not connect to server.");
        }
    }, [user, problemId, selectedLanguage, code, file, onSubmit, onVerdict]);

    const lineNumbers = useMemo(() => 
        Array.from({ length: code.split("\n").length || 1 }, (_, i) => (
            <span key={i}>{i + 1}</span>
        ))
    , [code]);

    console.log("CodeSubmission render");

    return (
        <div className="dou-submission-content">
            <div className="submission-header">
                <select 
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="language-selector"
                >
                    {programmingLanguages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
                <label className="upload-button">
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                    />
                    <span>↑ Upload File</span>
                </label>
            </div>

            <div className="code-editor-container">
                <textarea
                    className="code-editor"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Enter your code here..."
                    rows={15}
                />
                <div className="line-numbers">
                    {lineNumbers}
                </div>
            </div>

            <button onClick={handleSubmit} className="submit-button">
                Submit Code
            </button>

            {submissionStatus && (
                <div className={`submission-feedback ${
                    submissionStatus.includes("Accepted") ? "success" : 
                    submissionStatus.includes("Error") ? "error" : "info"
                }`}>
                    {submissionStatus}
                </div>
            )}
        </div>
    );
}