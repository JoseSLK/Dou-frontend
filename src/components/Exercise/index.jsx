import React, { useEffect, useState } from "react";
import "../Exercise/Exercise.css"
import { FormCreate } from "./FormCreate";
import { ExerciseView } from "./view/ExerciseView";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ExerciseProvider } from "../../Context/ExerciseContext";

export function Exercise( { initialTab= "" } ){
    const [status, setStatus] = useState("");
    const { problemId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Determinar el estado basado en la ruta actual
        if (location.pathname.includes('/search') || problemId) {
            setStatus("search");
        } else if (location.pathname.includes('/create')) {
            setStatus("create");
        }
    }, [location.pathname, problemId]);

    const handleSetSearch = () => {
        setStatus("search");
        navigate("/dashboard/exercises/search");
    }

    const handleSetCreate = () => {
        setStatus("create");
        navigate("/dashboard/exercises/create");
    }

    return (
        <ExerciseProvider>
            <div className="dou-exercises-content">
                <div className="dou-exercises-actions">
                    <button 
                        onClick={handleSetCreate} 
                        className={`dou-button-action create ${status === "create" ? "active" : ""}`}
                    >
                        Crear
                    </button>
                    <button 
                        onClick={handleSetSearch} 
                        className={`dou-button-action search ${status === "search" ? "active" : ""}`}
                    >
                        Buscar
                    </button>
                </div>

                {status === "create" ? (
                    <FormCreate /> 
                ) : status === "search" ? (
                    <ExerciseView initialProblemId={problemId} />
                ) : (
                    <div className="presentacion-container">
                        <h1><span className="emoji">📚</span> Guía: Cómo Interactuar con Ejercicios</h1>

                        <div className="content-scroll">
                            <div className="video-container">
                                <iframe 
                                    src="https://www.youtube.com/embed/rNbPchl_nV4?si=Q6mbglt0GPenNa8K" 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerPolicy="strict-origin-when-cross-origin" 
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="section">
                                <h2><span className="emoji">📘</span> Introducción</h2>
                                <p>
                                    En esta sección podrás <strong>crear y presentar ejercicios</strong>. Tendrás acceso a dos funciones principales: crear nuevos ejercicios y buscar entre los ya disponibles.
                                </p>
                            </div>

                            <div className="section">
                                <h2><span className="emoji">➕</span>Crear un Nuevo Ejercicio</h2>
                                <p>
                                    En la esquina superior izquierda encontrarás dos botones: <strong>"Crear"</strong> y <strong>"Buscar"</strong>.
                                </p>
                                <p>
                                    Al seleccionar el botón <strong>"Crear"</strong>, accederás a una interfaz donde podrás:
                                </p>
                                <ul>
                                    <li>Cargar un archivo ZIP con la estructura del ejercicio.</li>
                                    <li>Establecer nombre, límite de memoria y tiempo de ejecución.</li>
                                    <li>Seguir la guía paso a paso para subir tu ejercicio correctamente.</li>
                                </ul>
                            </div>

                            <div className="section">
                                <h2><span className="emoji">🔍</span>Buscar y Presentar Ejercicios</h2>
                                <p>
                                    Para presentar ejercicios, selecciona el botón <strong>"Buscar"</strong>. Allí encontrarás una entrada de texto que te permitirá localizar ejercicios por su <strong>ID o nombre</strong>.
                                </p>
                                <p>
                                    Una vez encuentres el ejercicio deseado:
                                </p>
                                <ol>
                                    <li>Haz clic sobre él para abrir la página de presentación.</li>
                                    <li>En la parte izquierda verás el <strong>enunciado del ejercicio</strong>.</li>
                                    <li>En la derecha, encontrarás un <strong>editor de código</strong> donde puedes:</li>
                                    <ul>
                                        <li>Pegar tu solución directamente.</li>
                                        <li>Opcionalmente, subir un archivo con tu código.</li>
                                    </ul>
                                    <li>No olvides seleccionar el <strong>lenguaje de programación correcto</strong> antes de enviar tu solución.</li>
                                </ol>
                            </div>

                            <div className="section">
                                <h2><span className="emoji">📤</span>Enviar Tu Solución</h2>
                                <p>
                                    Una vez tengas tu solución lista, envíala por cualquiera de las dos opciones mencionadas (editor o archivo). El sistema procesará tu envío y te mostrará el resultado obtenido.
                                </p>
                                <p>
                                    Además, se guardará un registro de tu presentación justo encima del editor de código para que puedas revisarlo cuando lo necesites.
                                </p>
                            </div>

                            <div className="section">
                                <h2><span className="emoji">📊</span>Ver Historial de Envíos</h2>
                                <p>
                                    Si deseas revisar tus intentos anteriores, haz clic en el <strong>icono de tu perfil</strong> en la barra superior. Allí encontrarás un <strong>historial de todos tus envíos</strong> realizados.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ExerciseProvider>
    );
}