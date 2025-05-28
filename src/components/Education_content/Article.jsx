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
        return <div className="dou-article">Selecciona un artículo para ver su contenido</div>;
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