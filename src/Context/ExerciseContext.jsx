import React, { createContext, useContext, useState, useEffect } from 'react';

const ExerciseContext = createContext();

export function ExerciseProvider({ children }) {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExercises = async () => {
        setLoading(true);
        setError(null);

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
            console.log("Ejercicios recibidos");
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

    const fetchExerciseById = async (problemId) => {
        if (!problemId) return;

        try {
            const response = await fetch(`http://localhost:8080/problem/${problemId}`, {
                method: "GET",
                mode: "cors",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Error fetching exercise data");
            }

            const data = await response.json();
            setSelectedExercise(data);
        } catch (error) {
            console.error("Error fetching exercise data:", error);
        }
    };

    const selectExercise = (exercise) => {
        setSelectedExercise(exercise);
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    return (
        <ExerciseContext.Provider value={{
            exercises,
            selectedExercise,
            loading,
            error,
            fetchExercises,
            fetchExerciseById,
            selectExercise
        }}>
            {children}
        </ExerciseContext.Provider>
    );
}

export function useExercise() {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExercise must be used within an ExerciseProvider');
    }
    return context;
} 