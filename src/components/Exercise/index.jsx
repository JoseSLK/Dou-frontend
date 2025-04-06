import React, { useState } from "react";
import "../Exercise/Exercise.css"
import { FormCreate } from "./FormCreate";
import { ExerciseView } from "./view/ExerciseView";

export function Exercise(){
    const [status, setStatus] = useState("");

    const handleSetSearch = () => {
        setStatus("search");
    }

    const handleSetCreate = () => {
        setStatus("create");    
    }

    return (
        <div className="dou-exercises-content">
            <div className="dou-exercises-actions">
                <button onClick={handleSetCreate} className="dou-button-action">Crear</button>
                <button onClick={handleSetSearch} className="dou-button-action">Buscar</button>
            </div>

            {status === "create" ? (
                    <FormCreate /> 
                ) : status === "search"? (
                    <ExerciseView />
                ) : (
                    <div>Por favor, selecciona una acción (Crear o Buscar).</div>
                )
            }

        </div>
    );
}