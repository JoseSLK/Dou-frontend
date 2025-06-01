import React, {useState} from "react";
import "../Exercise/FormCreate.css"
import { useExercise } from "../../Context/ExerciseContext";
import { exerciseService } from '../../services/exerciseService';

export function FormCreate() {
    const [title, setTitle] = useState(""); 
    const [memory, setMemory] = useState(""); 
    const [time, setTime] = useState("");    
    const [file, setFile] = useState(null);   
    const [error, setError] = useState("");   
    const [ok, setOk] = useState(false);
    const { fetchExercises } = useExercise();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); 

        if (!title || !memory || !time || !file) {
            setError("Todos los campos son obligatorios, incluyendo el archivo.");
            return; 
        }

        if (isNaN(parseInt(memory, 10)) || parseInt(memory, 10) <= 0) {
            setError("La memoria debe ser un número positivo.");
            return;
        }
        
        if (isNaN(parseInt(time, 10)) || parseInt(time, 10) <= 0) {
            setError("El tiempo de ejecución debe ser un número positivo.");
            return;
        }

        const formData = new FormData();
        formData.append('name', title);
        formData.append('m_limit', parseInt(memory, 10));
        formData.append('t_limit', parseInt(time, 10));
        formData.append('zip', file);

        try {
            await exerciseService.createProblem(formData);
            setOk(true);
            setError("Se ha creado el ejercicio, puedes visitar la sección buscar para verlo");

            // Actualizar la lista de ejercicios
            await fetchExercises();

            setTimeout(() => {
                setOk(false);
                setError("");
            }, 5000);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al crear el ejercicio.');
        }

        setTitle('');
        setMemory('');
        setTime('');
        setFile(null);
        event.target.reset();
    };
 
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]; 
        if (selectedFile) {
            setFile(selectedFile); 
            console.log("Archivo seleccionado:", selectedFile);
        } else {
            setFile(null); 
        }
    };
    
    return (
        <div className="dou-exercises-create">
            <div className="dou-form-container">
                <form className="dou-form-ex-c" onSubmit={handleSubmit} noValidate>
                    {error && <p className={`dou-form-error ${ok ? 'ok' : ''}`}>{error}</p>}

                    <div className="form-group">
                        <label htmlFor="exerciseTitle">Título del Ejercicio:</label>
                        <input
                            className="dou-input" 
                            type="text"
                            id="exerciseTitle"
                            name="title"
                            placeholder="Ej: Suma de dos números"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="dou-form-row"> 
                        <div className="form-group form-group-half"> 
                            <label htmlFor="memoryLimit">Memoria (MB):</label>
                            <input
                                className="dou-input" 
                                type="number"
                                id="memoryLimit"
                                name="memory"
                                placeholder="Ej: 256"
                                min="1"
                                value={memory}
                                onChange={(e) => setMemory(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group form-group-half">
                            <label htmlFor="timeLimit">Tiempo (ms):</label>
                            <input
                                className="dou-input"
                                type="number"
                                id="timeLimit"
                                name="time"
                                placeholder="Ej: 1000"
                                min="1"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exerciseFile">Archivo ZIP:</label>
                        <input
                            className="dou-input dou-input-file"
                            type="file"
                            id="exerciseFile"
                            name="zip"
                            accept=".zip"
                            onChange={handleFileChange}
                            required
                        />
                        {file && (
                            <div className="dou-file-name">
                                {file.name}
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="dou-button-submit"
                        disabled={error !== "" && !ok}
                    >
                        Crear Ejercicio
                    </button>
                </form>
            </div>

            <div className="dou-content-guide">
                <h1><span className="emoji">📁</span> Guía: Cómo Subir un Nuevo Ejercicio</h1>
                
                <div className="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/Ye5mD3NPNZE?si=iReAc5GLJjRU0-xW" 
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
                        En esta sección podrás crear y presentar ejercicios. A continuación te explicamos paso a paso cómo subir uno nuevo.
                    </p>
                </div>

                <div className="section">
                    <h2><span className="emoji">📤</span> Cómo Subir un Ejercicio</h2>
                    <p>
                        Para subir un ejercicio, dirígete al botón verde ubicado en la esquina superior izquierda de la interfaz. Al hacer clic, se abrirá un formulario con una entrada para cargar un archivo <strong>.zip</strong>. Este archivo es el componente más importante de tu ejercicio.
                    </p>
                </div>

                <div className="section">
                    <h2><span className="emoji">📦</span> Estructura del Archivo ZIP</h2>
                    <p>
                        El archivo ZIP debe llamarse <code>statement.zip</code> y su contenido debe seguir esta estructura:
                    </p>

                    <pre><code>statement.txt 
                    <br />
                    testCases/
                    <br />
                    _____input01.in
                    <br />
                    _____input02.in
                    <br />
                    ...
                    <br />
                    outputs/
                    <br />
                    _____output01.out
                    <br />
                    _____output02.out
                    <br />
                    ...</code></pre>

                    <ul>
                        <li><strong>statement.txt:</strong> Contiene el enunciado del ejercicio que los usuarios deberán resolver.</li>
                        <li><strong>testCases/:</strong> Carpeta que contiene los archivos de entrada para las pruebas.</li>
                        <li><strong>outputs/:</strong> Carpeta que contiene los archivos de salida esperados correspondientes a cada entrada.</li>
                    </ul>
                </div>

                <div className="section">
                    <h2><span className="emoji">🔢</span> Número de Casos de Prueba</h2>
                    <p>
                        Tú decides cuántos casos de prueba incluir. Sin embargo, debes asegurarte de que el número de archivos en la carpeta <strong>testCases</strong> sea exactamente igual al número de archivos en la carpeta <strong>outputs</strong>. Si no coinciden, el servidor rechazará la carga del ejercicio.
                    </p>
                </div>

                <div className="section">
                    <h2><span className="emoji">⚙️</span> Configuración Adicional</h2>
                    <p>
                        Una vez hayas creado y empaquetado correctamente el archivo ZIP, completa los siguientes campos en el formulario:
                    </p>
                    <ul>
                        <li><strong>Nombre del ejercicio:</strong> Un nombre claro y descriptivo.</li>
                        <li><strong>Límite de memoria:</strong> Establece el límite máximo de memoria permitido para la ejecución.</li>
                        <li><strong>Límite de tiempo:</strong> Define el tiempo máximo permitido para cada ejecución.</li>
                    </ul>
                </div>

                <div className="section">
                    <h2><span className="emoji">✅</span> Finalizar y Crear el Ejercicio</h2>
                    <p>
                        Una vez completados todos los campos y seleccionado el archivo ZIP, haz clic en el botón <strong>Crear Ejercicio</strong>. Tu ejercicio quedará listo para que los usuarios lo resuelvan.
                    </p>
                </div>
            </div>
        </div>
    );
}