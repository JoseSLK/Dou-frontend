// SubmissionArea.jsx
import React, { useState } from "react";
import { CodeSubmission } from "./CodeSubmission";
import { SubmissionList } from "./SubmissionList";
import "./style/Submission.css";

export function SubmissionArea({ problemId }) {
    const [activeTab, setActiveTab] = useState("submission");

    return (
        <div className="dou-submission-content">
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
                <CodeSubmission problemId={problemId} />
            ) : (
                <SubmissionList problemId={problemId}/>
            )}
        </div>
    );
}