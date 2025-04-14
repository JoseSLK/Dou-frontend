import React from "react";
import "./about.css";
import douLogo from "../../../public/dou_experimental.png";

export function About () {
    return (
        <div className="content-container">
            <h1>Sobre</h1>
            <img src={douLogo} alt="Logo DOU" className="dou-logo"/>

            <div className="dou-about-highlight">
                <p className="dou-about-p-1">Educadores, estudiantes y desarrolladores impulsan la tecnología al servicio del aprendizaje competitivo</p>
            </div>

            <div className="section-container">
                <h2 className="dou-t-2">¿Qué hace DOU?</h2>
                <div className="section-content">
                    <p className="dou-about-p-2">
                        DOU es una plataforma de aprendizaje diseñada para enseñar fundamentos de Java y programación competitiva.
                        Permite a los estudiantes mejorar sus habilidades a través de material educativo y mini competencias programadas.
                    </p>
                </div>
            </div>

            <div className="section-container">
                <h2 className="dou-t-3">¿Cómo acceder?</h2>
                <div className="section-content">
                    <p className="dou-about-p-3">
                        La plataforma está disponible únicamente para miembros de la institución. Para obtener acceso, es necesario 
                        solicitar un usuario a la administración de la universidad.
                    </p>
                </div>
            </div>

            <div className="section-container">
                <h2 className="dou-t-4">¿Cómo usar DOU?</h2>
                <div className="section-content">
                    <ul className="dou-about-p-4">
                        <li>Inicia sesión con el usuario proporcionado.</li>
                        <li>Accede a los cursos de aprendizaje de Java.</li>
                        <li>Resuelve ejercicios de programación competitiva y mejora tu clasificación.</li>
                        <li>Participa en mini competencias para poner a prueba tus habilidades.</li>
                    </ul>
                </div>
            </div>

            <div className="authors-container">
                <h2 className="dou-authors">Autores</h2>
                <p className="dou-about-p-5">
                    Este proyecto fue desarrollado por estudiantes de ingeniería de sistemas con el objetivo de proporcionar
                    una herramienta accesible y efectiva para el aprendizaje de la programación.
                </p>
            </div>

            <div className="dou-footer">
                © {new Date().getFullYear()} DOU - Todos los derechos reservados
            </div>
        </div>
    );
}