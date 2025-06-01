import React, { useEffect, useState } from "react";
import { useContent } from "../../Context/ContentContext";

function DownloadContent() {
    const { filesArticle } = useContent();
    
    if (!filesArticle || filesArticle.length === 0) {
        return null;
    }
    
    return (
        <div className="dou-dw-docs">
            <h3>Archivos adjuntos</h3>
            <div className="files-list">
                {filesArticle.map((file, index) => (
                    <div key={index} className="file-item">
                        <span className="file-name">{file.fileName}</span>
                        <a 
                            href={file.downloadUrl}
                            download={file.fileName}
                            className="dou-button-submit"
                        >
                            Descargar
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Article() {
    const { selectedMaterial, fetchArticleById } = useContent();
    const [AID, setAID] = useState();
    const [contentHTML, setContentHTML] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        if(!selectedMaterial) return;
        
        setAID(selectedMaterial.material_id);
        setContentHTML(selectedMaterial.description_path);
        setTitle(selectedMaterial.title);

        // Fetch article details and attachments
        fetchArticleById(parseInt(selectedMaterial.material_id));
    }, [selectedMaterial, fetchArticleById]);

    if (!selectedMaterial) {
        return (
            <div className="dou-article">
                <h1><span className="emoji">📘</span>Guía de Uso: Sistema de Artículos de DOU</h1>

                <iframe width="560" height="315" src="https://www.youtube.com/embed/NmGvU93p-xA?si=4wiatz8ZTZKTAhit" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

                <div className="section">
                    <h2><span className="emoji">💡</span>¿Qué es el sistema de artículos?</h2>
                    <p>
                        El sistema de artículos de DOU está diseñado para ser <strong>altamente personalizable</strong>. 
                        Aquí puedes leer artículos, crearlos e incluso adjuntar recursos adicionales como archivos 
                        descargables o videos utilizando etiquetas permitidas.
                    </p>
                </div>

                <div className="section">
                    <h2><span className="emoji">✍️</span>Cómo Crear un Artículo</h2>
                    <p>
                        Un artículo consta de un archivo principal en formato <code>.txt</code>. En este archivo debes 
                        plasmar toda la información que quieras compartir. Puedes utilizar ciertas etiquetas HTML para 
                        dar formato al contenido.
                    </p>

                    <h3>✅ Etiquetas permitidas:</h3>
                    <p>
                        {'<pre>'}, {'<code>'}, {'<article>'}, {'<header>'}, {'<section>'}, {'<pre>'}, {'<p>'}, {'<b>'}, 
                        {'<i>'}, {'<u>'}, {'<strong>'}, {'<em>'}, {'<br>'}, {'<h1>'}, {'<h2>'}, {'<h3>'}, {'<ul>'}, 
                        {'<ol>'}, {'<li>'}, {'<a>'}, {'<video>'}
                    </p>    

                    <h3>🔗 Atributos permitidos:</h3>
                    <ul>
                        <li>href</li>
                        <li>target</li>
                        <li>rel</li>
                        <li>video</li>
                    </ul>

                    <h3>📄 Ejemplo de contenido HTML válido:</h3>
                    <pre>
                        <code>{`<article>
    <h1>Mi primer artículo</h1>
    <p>Este es un párrafo de ejemplo con <strong>texto resaltado</strong>.</p>
    <h2>Lista de conceptos</h2>
    <ul>
        <li>Concepto 1</li>
        <li>Concepto 2</li>
    </ul>
    <p>Visita <a href="https://ejemplo.com" target="_blank">este enlace</a>.</p>
    <video src="mi-video.mp4"></video>
</article>`}</code>
                    </pre>

                    <h3>📁 Paso a paso para subir un artículo:</h3>
                    <ol>
                        <li>Prepara tu archivo.txt con el contenido formateado.</li>
                        <li>Accede a la interfaz de DOU.</li>
                        <li>Selecciona el archivo.txt para subirlo como artículo.</li>
                        <li>Si deseas incluir un archivo descargable (PDF, imagen, etc.), selecciónalo como archivo adjunto.</li>
                    </ol>
                </div>

                <div className="section">
                    <h2><span className="emoji">🛠️</span>Editar Artículos (Requiere permisos)</h2>
                    <p>Solo los usuarios con <strong>permisos especiales</strong> pueden editar artículos.</p>

                    <h3>🔁 Pasos para editar:</h3>
                    <ol>
                        <li>Selecciona el artículo que deseas editar.</li>
                        <li>Haz clic en la opción de edición que aparece en la parte superior derecha.</li>
                        <li>Se abrirá una pestaña donde podrás:
                            <ul>
                                <li>Subir un nuevo archivo.txt.</li>
                                <li>Adjuntar más recursos (archivos o videos).</li>
                            </ul>
                        </li>
                        <li>Confirma los cambios para actualizar el artículo.</li>
                    </ol>
                </div>

                <div className="section">
                    <h2><span className="emoji">❌</span>Eliminar Artículos (Requiere permisos)</h2>
                    <p>También necesitas <strong>permisos especiales</strong> para eliminar artículos.</p>

                    <h3>⚠️ Importante:</h3>
                    <p>La eliminación es <strong>permanente</strong>, así que asegúrate antes de proceder.</p>

                    <h3>Pasos para eliminar:</h3>
                    <ol>
                        <li>Selecciona el artículo que deseas eliminar.</li>
                        <li>Haz clic en el botón <strong>Eliminar</strong>.</li>
                        <li>Confirma la acción si estás seguro.</li>
                    </ol>
                </div>

                <div className="section">
                    <h2><span className="emoji">👥</span>Acceso a los artículos</h2>
                    <p>
                        Una vez que subes un artículo, <strong>cualquier usuario de DOU</strong> podrá acceder a él y leerlo. 
                        Si adjuntaste recursos, también estarán disponibles para descargar.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="dou-article">
            <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: contentHTML }}
            />
            <DownloadContent />
        </div>
    );
}