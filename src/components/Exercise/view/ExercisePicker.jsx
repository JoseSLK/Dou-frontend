import React, { useState, useMemo } from "react";
import { DataRowTuple } from "./DataRowTuple";
import "./style/ExercisePicker.css";
import { useExercise } from "../../../Context/ExerciseContext";

export function ExercisePicker({ onExerciseSelected, selectedExerciseId }) {
    const [searchTerm, setSearchTerm] = useState("");
    const { exercises, loading, error } = useExercise();

    const filteredExercises = useMemo(() => {
        if (!searchTerm) return exercises;
        return exercises.filter(
            (ex) =>
                ex.problem_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ex.problem_id.toString().includes(searchTerm)
        );
    }, [exercises, searchTerm]);

    return (
        <div className="exercise-picker-container">
            <div className="exercise-picker-search">
                <input
                    type="text"
                    placeholder="Buscar por nombre o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="dou-login-input"
                />
            </div>
            <div className="exercise-picker-list">
                {loading && <p className="picker-message">Cargando ejercicios...</p>}
                {error && <p className="picker-message picker-error">Error: {error}</p>}
                {!loading && !error && filteredExercises.length === 0 && (
                    <p className="picker-message">No se encontraron ejercicios.</p>
                )}
                {!loading &&
                    !error &&
                    filteredExercises.map((exercise) => (
                        <DataRowTuple
                            key={exercise.problem_id}
                            exercise={exercise}
                            onSelect={onExerciseSelected}
                            isSelected={exercise.problem_id === selectedExerciseId}
                        />
                    ))}
            </div>
        </div>
    );
}