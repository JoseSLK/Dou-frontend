import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./style/DisplayExercise.css";

export function DisplayExercise({ exercise }) {
    if (!exercise) {
        return (
            <div className="exercise-display exercise-display-empty">
                <p>Selecciona un ejercicio de la lista para ver sus detalles.</p>
            </div>
        );
    }

    const {
        problem_id,
        problem_name,
        problem_statement,
        problem_memory_mb_limit,
        problem_time_ms_limit,
    } = exercise;

    return (
        <div className="exercise-display">
            <h3 className="display-title">{problem_name} (ID: {problem_id})</h3>
            <div className="display-details">
                <h4 className="c-point">Statement:</h4>
                <div className="display-statement">
                    <ReactMarkdown
                        components={{
                            code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {problem_statement || "No hay enunciado disponible."}
                    </ReactMarkdown>
                </div>
            </div>

            <div className="display-limits">
                <h4><span className="c-point">Limits:</span></h4>
                <p><span className="c-point">Memory:</span> <strong>{problem_memory_mb_limit} MB</strong></p>
                <p><span className="c-point">Time:</span> <strong>{problem_time_ms_limit} ms</strong></p>
            </div>
        </div>
    );
}