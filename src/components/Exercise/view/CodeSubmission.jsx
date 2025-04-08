import React, { useState } from "react";
import "./style/Submission.css";
import { useAuth } from "../../../Context/AuthContext";

export function CodeSubmission({ problemId }) {
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [code, setCode] = useState("");
    const [file, setFile] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState(null); // New state for feedback
    const { user } = useAuth();

    const programmingLanguages = [
        { value: "cpp", label: "C++" },
        { value: "java", label: "Java" },
        { value: "python", label: "Python" },
        { value: "node", label: "node" },
    ];

    const handleLanguageChange = (e) => {
        console.log("Language changed to:", e.target.value);
        setSelectedLanguage(e.target.value);
    };

    const handleCodeChange = (e) => {
        console.log("Code updated, length:", e.target.value.length);
        setCode(e.target.value);
    };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        console.log("File uploaded:", {
            name: uploadedFile?.name,
            size: uploadedFile?.size,
            type: uploadedFile?.type
        });
        setFile(uploadedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit initiated", {
            userId: user.id,
            problemId,
            language: selectedLanguage,
            hasFile: !!file,
            codeLength: code.length
        });

        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("problem_id", problemId);
        formData.append("lang", selectedLanguage);

        if (file) {
            console.log("Submitting with file:", file.name);
            formData.append("source", file);
        } else {
            console.log("Submitting with code editor content");
            const blob = new Blob([code], { type: "text/plain" });
            const filename = `${problemId}.${selectedLanguage}.txt`;
            formData.append("source", blob, filename);
            console.log("Created blob:", { size: blob.size, filename });
        }

        try {
            console.log("Sending request to server...");
            setSubmissionStatus("Submitting..."); // Initial feedback
            const response = await fetch("http://localhost:8080/submission/", {
                method: "POST",
                body: formData,
            });

            console.log("Response received:", {
                status: response.status,
                statusText: response.statusText
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Submission successful, server response:", responseData);
                
                // Set feedback based on veredict
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
                
                // Clear feedback after 5 seconds
                setTimeout(() => setSubmissionStatus(null), 5000);
            } else {
                const errorText = await response.text();
                console.log("Submission failed:", {
                    status: response.status,
                    error: errorText
                });
                setSubmissionStatus("Submission failed. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error.message);
            setSubmissionStatus("Error: Could not connect to server.");
        }
    };

    console.log("Component render", { 
        selectedLanguage, 
        codeLength: code.length, 
        file: !!file, 
        submissionStatus 
    });

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
                    {Array.from({ length: code.split("\n").length || 1 }, (_, i) => (
                        <span key={i}>{i + 1}</span>
                    ))}
                </div>
            </div>

            <button onClick={handleSubmit} className="submit-button">
                Submit Code
            </button>

            {/* Feedback Display */}
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