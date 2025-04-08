import React, { useState, useEffect } from "react";
import "./style/Submission.css";
import { useAuth } from "../../../Context/AuthContext";

export function SubmissionList({ problemId }) {
    const [submissions, setSubmissions] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchSubmissions = async () => {
            console.log("Fetching submissions for:", { userId: user?.id, problemId });
            
            try {
                setLoading(true);
                
                const requestBody = {
                    user_id: user.id,
                    problem_id: problemId
                };
                console.log("Request body:", requestBody);

                const response = await fetch("http://localhost:8080/submission/attemps", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                console.log("Response received:", {
                    status: response.status,
                    statusText: response.statusText
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Response data:", data);

                // Ensure data is an array
                if (Array.isArray(data)) {
                    setSubmissions(data);
                    console.log("Submissions set, count:", data.length);
                } else {
                    setSubmissions(data ? [data] : []);
                    console.log("Data was not an array, converted to:", data ? [data] : []);
                }
            } catch (error) {
                console.error("Error fetching submissions:", error);
                setError(error.message);
                // Fallback to mock data
                const mockData = [{
                    submission_id: 1,
                    user_id: 1,
                    problem_id: 1,
                    submission_content: "#include <iostream>\r\nusing namespace std;\r\nint main() {\r\n    int t; cin >> t;\r\n    cout << t << '\\n';\r\n    return 0;\r\n}",
                    submission_answer_code: "AC"
                }];
                setSubmissions(mockData);
                console.log("Using mock data due to error:", mockData);
            } finally {
                setLoading(false);
                console.log("Fetch complete, loading set to false");
            }
        };

        if (user?.id && problemId) { // Only fetch if user and problemId are available
            fetchSubmissions();
        } else {
            console.log("Missing required data:", { userId: user?.id, problemId });
            setLoading(false);
        }
    }, [user, problemId]); // Add problemId as dependency

    const toggleExpand = (id) => {
        console.log("Toggling expansion for submission:", id);
        setExpanded(expanded === id ? null : id);
    };

    console.log("Rendering SubmissionList", { loading, error, submissionCount: submissions.length });

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