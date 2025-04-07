import React, { useState } from "react";
import { ExercisePicker } from "./ExercisePicker";
import { DisplayExercise } from "./DisplayExercise";
import "./style/ExerciseView.css";
import { SubmissionArea } from "./SubmissionExercise";

export function ExerciseView() {
    const [selectedExercise, setSelectedExercise] = useState(null);

    const handleExerciseSelect = (exercise) => {
        console.log("Ejercicio seleccionado en el padre:", exercise);
        setSelectedExercise(exercise);
    };

    return (
        <div className="exercise-view-container">
            
            {!selectedExercise ? (
                <ExercisePicker
                    onExerciseSelected={handleExerciseSelect}
                    selectedExerciseId={null}
                />
            ) : (
                <>
                    
                    <div className="exercise-view-left-panel">
                        <DisplayExercise exercise={selectedExercise} />
                    </div>
                    
                    <div className="exercise-view-right-panel">
                        
                        <SubmissionArea problemId={selectedExercise?.problem_id}/>

                    </div>
                </>
            )}
        </div>
    );
}