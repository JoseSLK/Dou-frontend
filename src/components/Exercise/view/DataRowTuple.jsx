import React from "react";
import "./style/DataRowTuple.css";

export function DataRowTuple({ exercise, onSelect, isSelected }) {

    const { problem_id, problem_name } = exercise;

    const handleClick = () => {
        onSelect(exercise);
    };

    const tupleClassName = `dou-tuple ${isSelected ? 'dou-tuple-selected' : ''}`;

    return (
    
        <div className={tupleClassName} onClick={handleClick}>
            
            <span className="dou-tuple-id">ID: {problem_id}</span>
            <span className="dou-tuple-name">{problem_name}</span>
            
        </div>
    );
}