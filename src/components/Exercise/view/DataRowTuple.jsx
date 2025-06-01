import React from "react";
import "./style/DataRowTuple.css";
import { Link } from "react-router-dom";

export function DataRowTuple({ exercise, onSelect, isSelected }) {

    const { problem_id, problem_name } = exercise;

    const handleClick = () => {
        onSelect(exercise);
    };

    const tupleClassName = `dou-tuple ${isSelected ? 'dou-tuple-selected' : ''}`;

    return (
    
        <div className={tupleClassName} onClick={handleClick}>
            <Link to={`/dashboard/exercises/${exercise.problem_id}`}>
                <span className="dou-tuple-id">ID: {problem_id}</span>
                <span className="dou-tuple-name">{problem_name}</span>
            </Link>
        </div>
    );
}