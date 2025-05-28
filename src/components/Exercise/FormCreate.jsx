import React, {useState} from "react";
import "../Exercise/FormCreate.css"
import { useExercise } from "../../Context/ExerciseContext";

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
            const response = await fetch('http://localhost:8080/problem/', { 
                method: 'POST', 
                mode: 'cors',
                credentials: 'include',
                body: formData 
            });

            if (!response.ok) {
                throw new Error('Error al crear el ejercicio');
            }

            const data = await response.json();
            console.log('Éxito:', data); 
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
            <div className="dou-content-guide">
                <h4>Guía Rápida</h4>
                <p>
                    Completa los detalles del nuevo ejercicio. Asegúrate de que el
                    archivo <strong>.zip</strong> contenga todo lo necesario.
                </p>
                <p>Define límites claros de memoria y tiempo para la ejecución.</p>
                <div className="guide-icon">📄➡️⚙️</div>
            </div>

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
        </div>
    );
}