import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../Context/AuthContext.jsx';
import { arenaService } from '../../services/arenaService.js';
import { CodeSubmission } from '../../components/Exercise/view/CodeSubmission.jsx';
import './ArenaCode.css';

/**
 * Componente que maneja la arena de programación competitiva.
 * Gestiona el matchmaking, la conexión WebSocket y la presentación de ejercicios.
 * 
 * @component
 * @returns {JSX.Element} Componente de arena con matchmaking y editor de código
 */
export function Arena() {
    const { user } = useAuth();
    const [matchState, setMatchState] = useState({
        isSearching: false,
        isMatched: false,
        roomId: null,
        problemId: null,
        opponent: null,
        hasOpponentSubmitted: false,
        hasUserSubmitted: false,
        winner: null,
        error: null
    });

    // Manejo de mensajes WebSocket
    const handleWebSocketMessage = useCallback((message) => {
        console.log('WebSocket message received:', message);

        switch (message.type) {
            case 'start':
                setMatchState(prev => ({
                    ...prev,
                    isSearching: false,
                    isMatched: true,
                    roomId: message.roomId,
                    problemId: message.problemId,
                    opponent: message.opponent,
                    error: null
                }));
                break;

            case 'submission':
                setMatchState(prev => ({
                    ...prev,
                    hasOpponentSubmitted: message.from === prev.opponent
                }));
                break;

            case 'verdict':
                if (message.from === matchState.opponent) {
                    // Actualizar estado con el veredicto del oponente
                    console.log('Opponent verdict:', message.verdict, message.verdict_value);
                }
                break;

            case 'winner':
                setMatchState(prev => ({
                    ...prev,
                    winner: message.winner,
                    isMatched: false
                }));
                break;

            case 'opponent_disconnected':
                setMatchState(prev => ({
                    ...prev,
                    isMatched: false,
                    error: 'Tu oponente se ha desconectado'
                }));
                break;

            case 'error':
                setMatchState(prev => ({
                    ...prev,
                    error: message.message,
                    isSearching: false
                }));
                break;

            default:
                console.warn('Unknown message type:', message.type);
        }
    }, [matchState.opponent]);

    // Inicializar WebSocket
    useEffect(() => {
        if (user?.id) {
            arenaService.setUserId(user.id);
            arenaService.setOnMessageCallback(handleWebSocketMessage);
            arenaService.connect();

            return () => {
                arenaService.disconnect();
            };
        }
    }, [user?.id, handleWebSocketMessage]);

    // Manejar inicio de búsqueda
    const handleStartSearch = useCallback(() => {
        setMatchState(prev => ({
            ...prev,
            isSearching: true,
            error: null,
            winner: null,
            hasOpponentSubmitted: false,
            hasUserSubmitted: false
        }));
        arenaService.joinQueue();
    }, []);

    // Manejar envío de solución
    const handleSubmitSolution = useCallback((problemId) => {
        if (matchState.roomId) {
            arenaService.sendSubmission(matchState.roomId);
            setMatchState(prev => ({
                ...prev,
                hasUserSubmitted: true
            }));
        }
    }, [matchState.roomId]);

    // Manejar veredicto
    const handleVerdict = useCallback((verdict, value) => {
        if (matchState.roomId) {
            arenaService.sendVerdict(matchState.roomId, verdict, value);
        }
    }, [matchState.roomId]);

    // Renderizado condicional basado en el estado
    if (matchState.error) {
        return (
            <div className="arena-error">
                <h2>Error</h2>
                <p>{matchState.error}</p>
                <button onClick={handleStartSearch}>Intentar de nuevo</button>
            </div>
        );
    }

    if (matchState.winner) {
        return (
            <div className="arena-result">
                <h2>¡{matchState.winner === user?.id ? 'Ganaste' : 'Perdiste'}!</h2>
                <button onClick={handleStartSearch}>Buscar nueva partida</button>
            </div>
        );
    }

    if (matchState.isMatched) {
        return (
            <div className="arena-match">
                <div className="arena-match-info">
                    <h2>Partida en curso</h2>
                    <p>Oponente: {matchState.opponent}</p>
                    {matchState.hasOpponentSubmitted && (
                        <p className="opponent-status">¡Tu oponente ha enviado su solución!</p>
                    )}
                </div>
                <CodeSubmission 
                    problemId={matchState.problemId}
                    onSubmit={handleSubmitSolution}
                    onVerdict={handleVerdict}
                />
            </div>
        );
    }

    return (
        <div className="arena-lobby">
            <h2>Arena de Programación</h2>
            <button 
                onClick={handleStartSearch}
                disabled={matchState.isSearching}
                className={`match-button ${matchState.isSearching ? 'matching' : ''}`}
            >
                {matchState.isSearching ? 'Buscando Oponente...' : 'Buscar Partida'}
            </button>
        </div>
    );
}

