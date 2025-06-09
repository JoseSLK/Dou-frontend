// SubmissionArea.jsx
import React, { useState } from "react";
import { CodeSubmission } from "./CodeSubmission";
import { SubmissionList } from "./SubmissionList";
import "./style/Submission.css";

export function SubmissionArea({ problemId, onSubmit, onVerdict }) {
    const [activeTab, setActiveTab] = useState("submission");

    return (
        <>
            <div className="submission-tabs">
                <button 
                    className={activeTab === "submission" ? "active-tab" : ""}
                    onClick={() => setActiveTab("submission")}
                >
                    Code Submission
                </button>
                <button 
                    className={activeTab === "list" ? "active-tab" : ""}
                    onClick={() => setActiveTab("list")}
                >
                    Submission List
                </button>
            </div>

            {activeTab === "submission" ? (
                <CodeSubmission 
                    problemId={problemId} 
                    onSubmit={onSubmit}
                    onVerdict={onVerdict}
                />
            ) : (
                <SubmissionList problemId={problemId}/>
            )}
        </>
    );
}