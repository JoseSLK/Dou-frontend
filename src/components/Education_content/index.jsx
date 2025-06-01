import React, { useEffect, useState  } from "react";
import "./educationContent.css";
import { useContent } from "../../Context/ContentContext";
import { useAuth } from "../../Context/AuthContext";
import { ArticleItem } from "./ArticleItem";
import { Article } from "./Article";
import { EditArticle } from "./EditArticle";
import { CreateArticle } from "./CreateArticle";
import { useParams } from "react-router-dom";

export function EducationContent ({ initialTab = "" }) {
    const { content, searchContent, searchArticles, selectedMaterial, fetchArticleById, setSelectedMaterial } = useContent();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { contentId } = useParams();

    useEffect(() => {
        if (contentId) {
            const articleId = parseInt(contentId);
            if (content && Array.isArray(content)) {
                const article = content.find(art => art.material_id === articleId);
                if (article) {
                    setSelectedMaterial(article);
                    fetchArticleById(articleId);
                } else {
                    fetchArticleById(articleId);
                }
            } else {
                fetchArticleById(articleId);
            }
        }
    }, [contentId, content, fetchArticleById, setSelectedMaterial]);

    const handleSearch = async (e) => {
        const term = e.target.value || "";
        setSearchQuery(term);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleEditClick = () => {
        setIsEditing(true);
        setIsCreating(false);
    }

    const handleCreateClick = () => {
        setIsCreating(true);
        setIsEditing(false);
    }

    const handleCloseEdit = () => {
        setIsEditing(false);
    }

    const handleCloseCreate = () => {
        setIsCreating(false);
    }

    useEffect(() => {
        if(!searchQuery.trim()){
            setDebouncedTerm("");
            return;
        }
        if (searchQuery.trim().length > 3) {
            const timer = setTimeout( () => {
                setDebouncedTerm(searchQuery.trim());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedTerm) {
            searchArticles(debouncedTerm);
        }
    }, [debouncedTerm, searchArticles]);

    const articlesToRender = debouncedTerm && searchContent?.length > 0
    ? searchContent
    : content || [];

    return (
        <div className="dou-education-content">
            <button className="menu-toggle" onClick={toggleMenu}>
                {isMenuOpen ? '✕' : '☰'}
            </button>
            <div className={`dou-menu-content ${isMenuOpen ? 'active' : ''}`}>
                <input 
                    type="text" 
                    className="dou-login-input search" 
                    placeholder="Buscar articulos..."
                    value={searchQuery}
                    onChange={handleSearch}
                />

                {articlesToRender?.length > 0 ? (
                    articlesToRender.map(article => (
                        <ArticleItem 
                            article={article} 
                            key={article.material_id} 
                            isSelected={article.material_id === parseInt(contentId)}
                        />
                    ))
                ) : (
                    <p>No se encontraron artículos.</p>
                )}
            </div>
            
            <div className="dou-content">
                {isEditing ? (
                    <EditArticle 
                        article={selectedMaterial} 
                        onClose={handleCloseEdit}
                    />
                ) : isCreating ? (
                    <CreateArticle onClose={handleCloseCreate} />
                ) : (
                    <>
                        {user?.role === "PROFESSOR" && (
                            <div className="action-buttons">
                                <button 
                                    className="create-button"
                                    onClick={handleCreateClick}
                                >
                                    Crear
                                </button>
                                {selectedMaterial && (
                                    <button 
                                        className="edit-button"
                                        onClick={handleEditClick}
                                    >
                                        Editar
                                    </button>
                                )}
                            </div>
                        )}
                        <Article />
                    </>
                )}
            </div>
        </div>
    );
}