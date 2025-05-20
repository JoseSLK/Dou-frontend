import React from "react";
import { useContent } from "../../Context/ContentContext";

export function ArticleItem ( { article, isSelected } ) {
    const { material_id, title } = article;
    const { setSelectedMaterial } = useContent();

    const handleClick = () => {
        setSelectedMaterial( article );
    };

    const tupleClassName = `dou-tuple ${isSelected? 'dou-tuple-selected' : ''}`;
    return (
        <div className={tupleClassName} onClick={handleClick}>
            <span className="dou-tuple-id">ID: {material_id}</span>
            <span className="dou-tuple-name">{title}</span>
        </div>
    )
}