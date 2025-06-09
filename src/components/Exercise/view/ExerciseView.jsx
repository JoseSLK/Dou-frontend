/**
 * @fileoverview Vista principal de ejercicios que integra la selección, visualización y envío de soluciones.
 * Coordina la interacción entre el selector de ejercicios, la visualización y el área de envío.
 * 
 * @module ExerciseView
 * @requires react
 * @requires react-router-dom
 */

import React, { useEffect, useCallback } from "react";
import { ExercisePicker } from "./ExercisePicker";
import { DisplayExercise } from "./DisplayExercise";
import "./style/ExerciseView.css";
import { SubmissionArea } from "./SubmissionArea";
import { useNavigate } from "react-router-dom";
import { useExercise } from "../../../Context/ExerciseContext";

/**
 * Componente que gestiona la vista completa de un ejercicio.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.initialProblemId=null] - ID del ejercicio a cargar inicialmente
 * @param {Function} [props.onSubmit] - Callback que se ejecuta cuando se envía una solución
 * @param {Function} [props.onVerdict] - Callback que se ejecuta cuando se recibe un veredicto
 * @returns {JSX.Element} Vista de ejercicio con selector o panel de ejercicio
 */
export function ExerciseView({ initialProblemId = null, onSubmit, onVerdict }) {
    const navigate = useNavigate();
    const { selectedExercise, exercises, selectExercise, fetchExerciseById } = useExercise();

    const handleExerciseSelect = useCallback((exercise) => {
        selectExercise(exercise);
    }, [selectExercise]);

    useEffect(() => {
        if (initialProblemId) {
            const exercise = exercises.find(ex => ex.problem_id === initialProblemId);
            if (exercise) {
                selectExercise(exercise);
            } else {
                fetchExerciseById(initialProblemId);
            }
        }
    }, [initialProblemId, exercises, selectExercise, fetchExerciseById]);

    return (
        <div className="exercise-view-container">
            {!selectedExercise ? (
                <ExercisePicker
                    onExerciseSelected={handleExerciseSelect}
                    selectedExerciseId={initialProblemId}
                />
            ) : (
                <>
                    <div className="exercise-view-left-panel">
                        <DisplayExercise exercise={selectedExercise} />
                    </div>
                    <div className="exercise-view-right-panel">
                        <SubmissionArea 
                            problemId={selectedExercise?.problem_id} 
                            onSubmit={onSubmit}
                            onVerdict={onVerdict}
                        />
                    </div>
                </>
            )}
        </div>
    );
}