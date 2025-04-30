import React, { useState, useEffect, useCallback, useRef } from "react";
import "./style/Submission.css";
import { useAuth } from "../../../Context/AuthContext";

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

export function SubmissionList({ problemId }) {
    const [submissions, setSubmissions] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useRenderCount('SubmissionList');

    const fetchSubmissions = useCallback(async () => {
        if (!user?.id || !problemId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const requestBody = {
                user_id: user.id,
                problem_id: problemId
            };

            const response = await fetch("http://localhost:8080/submission/attemps", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

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