/**
 * @fileoverview Contexto que gestiona el estado global de los ejercicios.
 * Maneja la carga, selección y obtención de ejercicios del sistema.
 * 
 * @module ExerciseContext
 * @requires react
 * @requires exerciseService
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { exerciseService } from '../services/exerciseService';

/**
 * Contexto que mantiene el estado de los ejercicios.
 * @type {React.Context}
 */
const ExerciseContext = createContext();

/**
 * Proveedor del contexto de ejercicios que maneja el estado global de los ejercicios.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * @returns {JSX.Element} Proveedor del contexto de ejercicios
 */
export function ExerciseProvider({ children }) {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Carga todos los ejercicios disponibles.
     * 
     * @async
     * @callback
     * @returns {Promise<void>}
     * @throws {Error} Si hay un error al cargar los ejercicios
     */
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

    /**
     * Obtiene un ejercicio específico por su ID.
     * 
     * @async
     * @callback
     * @param {string} problemId - ID del ejercicio a obtener
     * @returns {Promise<void>}
     * @throws {Error} Si hay un error al cargar el ejercicio
     */
    const fetchExerciseById = useCallback(async (problemId) => {
        if (!problemId) return;

        try {
            const data = await exerciseService.getExerciseById(problemId);
            setSelectedExercise(data);
        } catch (error) {
            console.error("Error fetching exercise data:", error);
        }
    }, []);

    /**
     * Selecciona un ejercicio para visualización o edición.
     * 
     * @callback
     * @param {Object} exercise - Ejercicio a seleccionar
     */
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

/**
 * Hook personalizado para acceder al contexto de ejercicios.
 * 
 * @returns {Object} Contexto de ejercicios
 * @throws {Error} Si se usa fuera de un ExerciseProvider
 */
export function useExercise() {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExercise must be used within an ExerciseProvider');
    }
    return context;
}