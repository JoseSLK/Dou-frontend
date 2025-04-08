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
                    <div class="presentacion-container">
                        <h2>Presentación de Ejercicios</h2>
                        <p><span class="highlight">¡Bienvenido!</span> Aquí puedes gestionar tus ejercicios de programación competitiva.</p>
                        <p>Por favor, selecciona una acción para continuar: <span class="highlight">Crear</span> un nuevo desafío o <span class="highlight">Buscar</span> uno ya existente.</p>
                        <p>Recuerda que cada ejercicio es una oportunidad para mejorar tus habilidades y avanzar en el ranking. 💪</p>
                    </div>
                )
            }

        </div>
    );
}