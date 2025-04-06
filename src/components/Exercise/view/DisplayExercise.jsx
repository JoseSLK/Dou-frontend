import React from "react";
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
                <h4>Enunciado:</h4>
                <div
                    className="display-statement"
                    dangerouslySetInnerHTML={{ __html: problem_statement || "No disponible." }}
                />
            </div>
            <div className="display-limits">
                <h4>Límites:</h4>
                <p>Memoria: <strong>{problem_memory_mb_limit} MB</strong></p>
                <p>Tiempo: <strong>{problem_time_ms_limit} ms</strong></p>
            </div>
        </div>
    );
}