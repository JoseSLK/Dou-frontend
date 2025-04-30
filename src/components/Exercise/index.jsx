import React, { useEffect, useState } from "react";
import "../Exercise/Exercise.css"
import { FormCreate } from "./FormCreate";
import { ExerciseView } from "./view/ExerciseView";
import { useParams } from "react-router-dom";
import { ExerciseProvider } from "../../Context/ExerciseContext";

export function Exercise( { initialTab= "" } ){
    const [status, setStatus] = useState("");
    const { problemId } = useParams();

    useEffect(() => {
        if(problemId) {
            setStatus("search");
        }
    },[problemId]);

    const handleSetSearch = () => {
        setStatus("search");
    }

    const handleSetCreate = () => {
        setStatus("create");    
    }

    return (
        <ExerciseProvider>
            <div className="dou-exercises-content">
                <div className="dou-exercises-actions">
                    <button onClick={handleSetCreate} className="dou-button-action">Crear</button>
                    <button onClick={handleSetSearch} className="dou-button-action">Buscar</button>
                </div>

                {status === "create" ? (
                        <FormCreate /> 
                    ) : status === "search"? (
                        <ExerciseView initialProblemId={problemId} />
                    ) : (
                        <div className="presentacion-container">
                            <h2>Presentación de Ejercicios</h2>
                            <p><span className="highlight">¡Bienvenido!</span> Aquí puedes gestionar tus ejercicios de programación competitiva.</p>
                            <p>Por favor, selecciona una acción para continuar: <span className="highlight">Crear</span> un nuevo desafío o <span className="highlight">Buscar</span> uno ya existente.</p>
                            <p>Recuerda que cada ejercicio es una oportunidad para mejorar tus habilidades y avanzar en el ranking. 💪</p>
                        </div>
                    )
                }
            </div>
        </ExerciseProvider>
    );
}