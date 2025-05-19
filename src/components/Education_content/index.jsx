import React, { useEffect, useState  } from "react";
import "./educationContent.css";
import { useContent } from "../../Context/ContentContext";
import { ArticleItem } from "./ArticleItem";
import { Article } from "./Article";

export function EducationContent () {
    const { content, searchContent, searchArticles } = useContent();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearch = async (e) => {
        const term = e.target.value || "";
        setSearchQuery(term);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
    : content;

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
                        <ArticleItem article={article} key={article.material_id} />
                    ))
                ) : (
                    <p>No se encontraron artículos.</p>
                )}
            </div>
            <div className="dou-content">
                <Article />
            </div>
        </div>
    );
}