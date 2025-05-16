import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "../components/header";
import "./meteor.css";
import "./index.css";
import { AppRoutes } from "./AppRoutes";
import { AuthProvider } from "../Context/AuthContext";

export function AppUI () {
    

    return (
        <Router basename="/">
            <AuthProvider>
                <div className="app">
                    <div className="star" id="position"></div>
                    
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className={`meteor-${index + 1}`}></div>
                    ))}
                    
                    <Header />
                    <AppRoutes />
                    
                </div>
            </AuthProvider>
            
        </Router>
    )
}
