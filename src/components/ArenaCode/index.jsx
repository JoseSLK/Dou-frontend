import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext.jsx';
import { arenaService } from '../../services/arenaService.js';
import { ArenaExerciseView } from './ArenaExerciseView.jsx';
import { ExerciseProvider } from '../../Context/ExerciseContext.jsx';
import "./ArenaCode.css";
import "./BlackHoleAnimation.css";

export function ArenaCode() {
    const { user } = useAuth();
    const [matchState, setMatchState] = useState({
        isSearching: false,
        isMatched: false,
        roomId: null,
        problemId: null,
        opponent: null,
        hasOpponentSubmitted: false,
        hasUserSubmitted: false,
        opponentVerdict: null,
        winner: null,
        error: null
    });

    // Manejo de mensajes WebSocket
    const handleWebSocketMessage = useCallback((message) => {
        console.log('WebSocket message received:', message);
        
        // Usar una función de actualización que tenga acceso al estado más reciente
        setMatchState(prev => {
            console.log('Estado actual en setMatchState:', {
                hasOpponentSubmitted: prev.hasOpponentSubmitted,
                opponentVerdict: prev.opponentVerdict,
                opponent: prev.opponent
            });

            switch (message.type) {
                case 'start':
                    console.log('Procesando mensaje START');
                    const startState = {
                        ...prev,
                        isSearching: false,
                        isMatched: true,
                        roomId: message.roomId,
                        problemId: message.problemId,
                        opponent: message.opponent,
                        error: null,
                        opponentVerdict: null,
                        hasOpponentSubmitted: false
                    };
                    console.log('Nuevo estado después de START:', startState);
                    return startState;

                case 'submission':
                    console.log('Procesando mensaje SUBMISSION');
                    if (message.from === prev.opponent) {
                        console.log('Submission del oponente detectada');
                        const submissionState = {
                            ...prev,
                            hasOpponentSubmitted: true
                        };
                        console.log('Nuevo estado después de SUBMISSION:', submissionState);
                        return submissionState;
                    } else {
                        console.log('Submission ignorada - no es del oponente actual');
                        return prev;
                    }

                case 'verdict':
                    console.log('Procesando mensaje VERDICT');
                    if (message.from === prev.opponent) {
                        console.log('Veredicto del oponente recibido:', message.verdict);
                        const verdictState = {
                            ...prev,
                            opponentVerdict: message.verdict,
                            hasOpponentSubmitted: false
                        };
                        console.log('Nuevo estado después de VERDICT:', verdictState);
                        return verdictState;
                    } else {
                        console.log('Veredicto ignorado - no es del oponente actual');
                        return prev;
                    }

                case 'winner':
                    return {
                        ...prev,
                        winner: message.winner,
                        isMatched: false
                    };

                case 'opponent_disconnected':
                    return {
                        ...prev,
                        isMatched: false,
                        error: 'Tu oponente se ha desconectado'
                    };

                case 'error':
                    if (arenaService.ws) {
                        arenaService.disconnect();
                    }
                    return {
                        ...prev,
                        error: message.message,
                        isSearching: false
                    };

                default:
                    console.warn('Unknown message type:', message.type);
                    return prev;
            }
        });
    }, []); // Ya no necesitamos dependencias porque usamos la función de actualización

    // Efecto para manejar el reseteo automático de estados
    useEffect(() => {
        console.log('Estado actual en useEffect de reseteo:', {
            hasOpponentSubmitted: matchState.hasOpponentSubmitted,
            opponentVerdict: matchState.opponentVerdict
        });

        let submissionTimeout;
        let verdictTimeout;

        if (matchState.hasOpponentSubmitted) {
            console.log('Configurando timeout para submission');
            submissionTimeout = setTimeout(() => {
                console.log('Timeout de submission ejecutado');
                setMatchState(prev => {
                    const newState = {
                        ...prev,
                        hasOpponentSubmitted: false
                    };
                    console.log('Nuevo estado después de timeout submission:', newState);
                    return newState;
                });
            }, 6000);
        }

        if (matchState.opponentVerdict) {
            console.log('Configurando timeout para veredicto');
            verdictTimeout = setTimeout(() => {
                console.log('Timeout de veredicto ejecutado');
                setMatchState(prev => {
                    const newState = {
                        ...prev,
                        opponentVerdict: null
                    };
                    console.log('Nuevo estado después de timeout veredicto:', newState);
                    return newState;
                });
            }, 6000);
        }

        return () => {
            console.log('Limpiando timeouts');
            if (submissionTimeout) clearTimeout(submissionTimeout);
            if (verdictTimeout) clearTimeout(verdictTimeout);
        };
    }, [matchState.hasOpponentSubmitted, matchState.opponentVerdict]);

    // Limpiar conexión al desmontar
    useEffect(() => {
        return () => {
            if (arenaService.ws) {
                console.log('Desconectando WebSocket (componente desmontado)');
                arenaService.disconnect();
            }
        };
    }, []);

    // Manejar inicio de búsqueda
    const handleStartSearch = useCallback(() => {
        if (matchState.isSearching) return;

        // Limpiar estado previo
        setMatchState(prev => ({
            ...prev,
            error: null,
            isSearching: true,
            winner: null,
            hasOpponentSubmitted: false,
            hasUserSubmitted: false,
            opponentVerdict: null
        }));

        // Configurar WebSocket solo si no existe
        if (!arenaService.ws) {
            console.log('Iniciando conexión WebSocket para usuario:', user?.id);
            arenaService.setUserId(user?.id);
            arenaService.setOnMessageCallback(handleWebSocketMessage);
            arenaService.connect();
        } else {
            // Si ya existe conexión, solo unirse a la cola
            arenaService.joinQueue();
        }
    }, [user?.id, matchState.isSearching, handleWebSocketMessage]);

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
            <div className="dou-arena-code">
                <div className="dou-arena-code-header">
                    <h1 className="arena-title">Error</h1>
                    <p className="arena-description">{matchState.error}</p>
                    <button 
                        className="match-button"
                        onClick={handleStartSearch}
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    if (matchState.winner) {
        return (
            <div className="dou-arena-code">
                <div className="arena-result-container">
                    <div className="arena-result-content">
                        <div className="arena-result-text">
                            <h1 className="arena-title">
                                ¡{matchState.winner === user?.id ? 'Ganaste' : 'Perdiste'}!
                            </h1>
                            <button 
                                className="match-button"
                                onClick={handleStartSearch}
                            >
                                Buscar nueva partida
                            </button>
                        </div>
                        {matchState.winner === user?.id ? (
                            <div className="arena-result-image winner">
                                <img src="/wis.jpg" alt="Whis" />
                            </div>
                        ) : (
                            <div className="arena-result-image">
                                <img src="/goku.jpg" alt="Goku" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (matchState.isMatched) {
        console.log('Renderizando estado MATCHED:', {
            hasOpponentSubmitted: matchState.hasOpponentSubmitted,
            opponentVerdict: matchState.opponentVerdict,
            opponent: matchState.opponent
        });

        return (
            <div className="dou-arena-code">
                <div className="dou-arena-code-header">
                    <div className="arena-header-content">
                        <div className="arena-player-info">
                            <span className="arena-player-label">Oponente:</span>
                            <span className="arena-player-name">{matchState.opponent}</span>
                        </div>
                        
                        <div className={`arena-status-container ${matchState.hasOpponentSubmitted ? 'active' : ''}`}>
                            <div className="arena-status-indicator"></div>
                            <span className="arena-status-text">Enviando solución...</span>
                        </div>

                        <div className={`arena-verdict-container ${matchState.opponentVerdict ? 'active' : ''}`}>
                            <span className="arena-verdict-label">Estado:</span>
                            <span className={`arena-verdict-value ${matchState.opponentVerdict?.toLowerCase() || ''}`}>
                                {matchState.opponentVerdict || 'Pendiente'}
                            </span>
                        </div>
                    </div>
                </div>
                <ExerciseProvider>
                    <ArenaExerciseView 
                        problemId={matchState.problemId} 
                        onSubmit={handleSubmitSolution}
                        onVerdict={handleVerdict}
                    />
                </ExerciseProvider>
            </div>
        );
    }

    return (
        <div className="dou-arena-code">
            <h1 className="arena-title">Arena de Programación</h1>
            <p className="arena-description">
                ¡Prepárate para el desafío! Encuentra un oponente y pon a prueba tus habilidades de programación 
                en tiempo real. Resuelve problemas, compite y mejora tus habilidades.
            </p>
            <button 
                className={`match-button ${matchState.isSearching ? 'matching' : ''}`}
                onClick={handleStartSearch}
                disabled={matchState.isSearching}
            >
                {matchState.isSearching ? 'Buscando Oponente...' : 'Encontrar Oponente'}
            </button>

            {matchState.isSearching && (
                <div className="black-hole-overlay">
                    <div className="black-hole">
                        <div className="black-hole-core"></div>
                        <div className="black-hole-ring ring-1"></div>
                        <div className="black-hole-ring ring-2"></div>
                        <div className="black-hole-ring ring-3"></div>
                        <div className="particles">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="particle"></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}