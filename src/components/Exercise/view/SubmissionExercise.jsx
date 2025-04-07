import React, { useState, useContext } from "react";
import "./style/Submission.css";
import { useAuth } from "../../../Context/AuthContext"; // Adjust the path as needed

export function SubmissionArea({ problemId }) {
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [code, setCode] = useState("");
    const [file, setFile] = useState(null);
    const { user } = useAuth();

    const programmingLanguages = [
        { value: "cpp", label: "C++" },
        { value: "java", label: "Java" },
        { value: "python", label: "Python" },
        { value: "node", label: "node" },
    ];

    const handleLanguageChange = (e) => {
        console.log("Lenguaje seleccionado:", e.target.value);
        setSelectedLanguage(e.target.value);
    };

    const handleCodeChange = (e) => {
        console.log("Código actualizado, líneas:", e.target.value.split("\n").length);
        setCode(e.target.value);
    };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        console.log("Archivo subido:", uploadedFile?.name, "Tamaño:", uploadedFile?.size);
        setFile(uploadedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Iniciando submit...");

        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("problem_id", problemId);
        formData.append("lang", selectedLanguage);

        console.log("Datos básicos del FormData:", {
            user_id: user.id,
            problem_id: problemId,
            lang: selectedLanguage,
        });

        if (file) {
            console.log("Modo archivo: Usando archivo subido");
            formData.append("source", file);
        } else {
            console.log("Modo editor: Creando blob desde el código");
            const blob = new Blob([code], { type: "text/plain" });
            const filename = `${problemId}.${selectedLanguage}.txt`;
            formData.append("source", blob, filename);
            console.log("Blob creado:", filename, "Tamaño:", blob.size);
        }

        try {
            console.log("Enviando solicitud a http://localhost:8080/submission");
            const response = await fetch("http://localhost:8080/submission/", {
                method: "POST",
                body: formData,
            });

            console.log("Respuesta recibida. Status:", response.status);
            if (response.ok) {
                console.log("Submission successful");
                const responseData = await response.json();
                console.log("Respuesta del servidor:", responseData);
                setCode("");
                setFile(null);
            } else {
                console.log("Error en la respuesta. Status:", response.status);
                const errorText = await response.text();
                console.log("Mensaje del servidor:", errorText);
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    return (
        <div className="dou-submission-content">
            {/* Tab Menu */}
            <div className="submission-tabs">
                <button className="active-tab">Code Submission</button>
                <button disabled>Future Feature</button>
            </div>

            {/* Header with language selector and upload button */}
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

            {/* Code Editor */}
            <div className="code-editor-container">
                <textarea
                    className="code-editor"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Enter your code here..."
                    rows={15}
                />
                <div className="line-numbers">
                    {Array.from({ length: code.split("\n").length || 1 }, (_, i) => (
                        <span key={i}>{i + 1}</span>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit} className="submit-button">
                Submit
            </button>
        </div>
    );
}