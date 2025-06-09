import React, { useEffect, useCallback, useState } from 'react';
import { ExerciseView } from '../Exercise/view/ExerciseView.jsx';
import { useExercise } from '../../Context/ExerciseContext.jsx';

/**
 * Componente que maneja la vista de ejercicio en la arena, seleccionando un ejercicio aleatorio
 * y manteniendo la sincronización con el contexto de ejercicios.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.problemId - ID del problema asignado para la partida
 * @param {Function} [props.onSubmit] - Callback que se ejecuta cuando se envía una solución
 * @param {Function} [props.onVerdict] - Callback que se ejecuta cuando se recibe un veredicto
 * @returns {JSX.Element} Vista de ejercicio con el problema seleccionado
 */
export function ArenaExerciseView({ problemId, onSubmit, onVerdict }) {
    const { exercises, selectExercise, fetchExerciseById } = useExercise();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Seleccionar ejercicio aleatorio si no hay uno asignado
    const selectRandomExercise = useCallback(() => {
        if (exercises.length > 0) {
            try {
                const randomIndex = Math.floor(Math.random() * exercises.length);
                const randomExercise = exercises[randomIndex];
                console.log('Ejercicio aleatorio seleccionado:', randomExercise.problem_id);
                selectExercise(randomExercise);
                setError(null);
            } catch (err) {
                console.error('Error al seleccionar ejercicio aleatorio:', err);
                setError('Error al seleccionar ejercicio. Por favor, intenta de nuevo.');
            }
        } else {
            setError('No hay ejercicios disponibles.');
        }
        setIsLoading(false);
    }, [exercises, selectExercise]);

    // Efecto para manejar la selección del ejercicio
    useEffect(() => {
        const loadExercise = async () => {
            setIsLoading(true);
            setError(null);

            try {
                if (problemId) {
                    // Si tenemos un problemId específico, buscar ese ejercicio
                    const exercise = exercises.find(ex => ex.problem_id === problemId);
                    if (exercise) {
                        console.log('Seleccionando ejercicio asignado:', problemId);
                        selectExercise(exercise);
                    } else {
                        console.log('Buscando ejercicio asignado:', problemId);
                        await fetchExerciseById(problemId);
                    }
                } else {
                    // Si no hay problemId, seleccionar uno aleatorio
                    selectRandomExercise();
                }
            } catch (err) {
                console.error('Error al cargar ejercicio:', err);
                setError('Error al cargar el ejercicio. Por favor, intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        };

        loadExercise();
    }, [problemId, exercises, selectExercise, fetchExerciseById, selectRandomExercise]);

    if (isLoading) {
        return (
            <div className="arena-exercise-loading">
                <div className="loading-spinner"></div>
                <p>Cargando ejercicio...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="arena-exercise-error">
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="arena-exercise-view">
            <ExerciseView 
                initialProblemId={problemId} 
                onSubmit={onSubmit}
                onVerdict={onVerdict}
            />
        </div>
    );
} 