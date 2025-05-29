import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { exerciseService } from '../services/exerciseService';

const ExerciseContext = createContext();

export function ExerciseProvider({ children }) {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExercises = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await exerciseService.getAllExercises();
            console.log("Ejercicios recibidos");
            setExercises(data);
        } catch (err) {
            console.error("Error en fetchExercises:", err);
            setError(err.message || "Error al cargar ejercicios");
            setExercises([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchExerciseById = useCallback(async (problemId) => {
        if (!problemId) return;

        try {
            const data = await exerciseService.getExerciseById(problemId);
            setSelectedExercise(data);
        } catch (error) {
            console.error("Error fetching exercise data:", error);
        }
    }, []);

    const selectExercise = useCallback((exercise) => {
        setSelectedExercise(exercise);
    }, []);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    const value = useMemo(() => ({
        exercises,
        selectedExercise,
        loading,
        error,
        fetchExercises,
        fetchExerciseById,
        selectExercise
    }), [exercises, selectedExercise, loading, error, fetchExercises, fetchExerciseById, selectExercise]);

    return (
        <ExerciseContext.Provider value={value}>
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