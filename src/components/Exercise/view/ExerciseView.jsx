import React, { useEffect, useCallback } from "react";
import { ExercisePicker } from "./ExercisePicker";
import { DisplayExercise } from "./DisplayExercise";
import "./style/ExerciseView.css";
import { SubmissionArea } from "./SubmissionArea";
import { useNavigate } from "react-router-dom";
import { useExercise } from "../../../Context/ExerciseContext";

export function ExerciseView({ initialProblemId = null }) {
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
                        <SubmissionArea problemId={selectedExercise?.problem_id} />
                    </div>
                </>
            )}
        </div>
    );
}