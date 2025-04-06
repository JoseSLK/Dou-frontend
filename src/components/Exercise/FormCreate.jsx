import React, {useState} from "react";
import "../Exercise/FormCreate.css"

export function FormCreate() {
     const [title, setTitle] = useState(""); 
     const [memory, setMemory] = useState(""); 
     const [time, setTime] = useState("");    
     const [file, setFile] =     useState(null);   
     const [error, setError] = useState("");   
     const [ok, setOk] = useState(false);
 
     const handleSubmit = (event) => {
         event.preventDefault();
         setError(""); 
 
         
         console.log("Datos listos para manipular:");
         console.log("Título:", title); 
         console.log("Memoria (MB):", memory); 
         console.log("Tiempo (ms):", time);     
         console.log("Archivo:", file);      
 
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
        console.log("formData después de 'name':", formData.get('name'));
        formData.append('m_limit', parseInt(memory, 10));
        console.log("formData después de 'm_limit':", formData.get('m_limit'));
        formData.append('t_limit', parseInt(time, 10));
        console.log("formData después de 't_limit':", formData.get('t_limit'));
        formData.append('zip', file);
        console.log("formData después de 'zip':", formData.get('zip'));
        console.log("FormData listo para enviar:", formData);

        console.log("FormData listo para enviar:", formData);

        fetch('http://localhost:8080/problem/', { 
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            body: formData 
        })
        .then(response => response.json())
        .then(data => { 
            console.log('Éxito:', data); 
            setOk(true);
            setError("Se ha creado el ejercicio, puedes visitar la seccion buscar para verlo");

            setTimeout(() => {
                setOk(false);
                setError("");
            }, 5000);
        })
        .catch(error => { console.error('Error:', error); setError('Error al crear el ejercicio.'); });
 
        setTitle(''); setMemory(''); setTime(''); setFile(null); event.target.reset(); 
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
                    {error && <p className={`dou-form-error ${ok? 'ok' : ''}`}>{error}</p>}

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

                    {/* Grupo Archivo */}
                    <div className="form-group">
                        <label htmlFor="zipFile">Archivo de Casos (.zip):</label>
                        <input
                            className="dou-input-file" 
                            type="file"
                            id="zipFile"
                            name="file"
                            accept=".zip"
                            onChange={handleFileChange}
                            required
                        />
                        {file && <span className="dou-file-name">Seleccionado: {file.name}</span>}
                    </div>

                    <button type="submit" className="dou-button-submit">
                        Crear Ejercicio
                    </button>
                </form>
            </div>

            <div className="dou-content-guide">
                <h4>Guía Rápida</h4>
                <p>
                    Completa los detalles del nuevo ejercicio. Asegúrate de que el
                    archivo <strong>.zip</strong> contenga todo lo necesario.
                </p>
                <p>Define límites claros de memoria y tiempo para la ejecución.</p>
                <div className="guide-icon">📄➡️⚙️</div>
            </div>
        </div>
    );
}