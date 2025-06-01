import React from "react";
import { useContent } from "../../Context/ContentContext";
import { Link, useNavigate } from "react-router-dom";

export function ArticleItem ( { article, isSelected } ) {
    const { material_id, title } = article;
    const { setSelectedMaterial } = useContent();
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedMaterial(article);
        navigate(`/dashboard/education/${material_id}`);
    };

    const tupleClassName = `dou-tuple ${isSelected? 'dou-tuple-selected' : ''}`;
    return (
        <div className={tupleClassName} onClick={handleClick}>
            <Link to={`/dashboard/education/${material_id}`}>
                <span className="dou-tuple-id">ID: {material_id}</span>
                <span className="dou-tuple-name">{title}</span>
            </Link>
        </div>
    )
}