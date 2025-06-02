/**
 * @fileoverview Componente que renderiza un elemento individual de la lista de artículos.
 * 
 * @module ArticleItem
 * @requires react
 * @requires react-router-dom
 */

import React from "react";
import { useContent } from "../../Context/ContentContext";
import { Link, useNavigate } from "react-router-dom";

/**
 * Componente que representa un artículo individual en la lista de artículos.
 * Al hacer clic, navega a la vista detallada del artículo.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.article - Datos del artículo a mostrar
 * @param {boolean} props.isSelected - Indica si el artículo está actualmente seleccionado
 * @returns {JSX.Element} Elemento de lista representando un artículo
 */
export function ArticleItem({ article, isSelected }) {
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