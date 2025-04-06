import React, { useState, useEffect, useMemo } from "react";
import { DataRowTuple } from "./DataRowTuple";
import "./style/ExercisePicker.css";

export function ExercisePicker({ onExerciseSelected, selectedExerciseId }) {
    const [exercises, setExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchExercises = async () => {
            try {
                const response = await fetch("http://localhost:8080/problem/", {
                    method: "GET",
                    mode: "cors",
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorMsg = `Error ${response.status}: ${response.statusText}`;
                    throw new Error(errorMsg);
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setExercises(data);
                } else {
                    console.warn("La respuesta no es un array:", data);
                    setExercises([]);
                    throw new Error("Formato de datos inesperado recibido del servidor.");
                }
            } catch (err) {
                console.error("Error en fetchExercises:", err);
                setError(err.message || "Error al cargar ejercicios");
                setExercises([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

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