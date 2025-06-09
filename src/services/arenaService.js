import { API_URL } from '../config/constants';

class ArenaService {
    constructor() {
        this.ws = null;
        this.userId = null;
        this.onMessageCallback = null;
        this.isConnecting = false;
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 3;
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('WebSocket ya está conectado');
            return;
        }

        if (this.isConnecting) {
            console.log('Ya hay un intento de conexión en proceso');
            return;
        }

        if (this.connectionAttempts >= this.maxConnectionAttempts) {
            console.error('Máximo número de intentos de conexión alcanzado');
            return;
        }

        this.isConnecting = true;
        this.connectionAttempts++;
        console.log(`Iniciando conexión WebSocket (intento ${this.connectionAttempts})...`);

        try {
            if (this.ws?.readyState === WebSocket.CLOSING) {
                this.ws.close();
                this.ws = null;
            }

            this.ws = new WebSocket(`${API_URL}/ws/`);

            this.ws.onopen = () => {
                console.log('Conexión WebSocket establecida');
                this.isConnecting = false;
                this.connectionAttempts = 0;
                if (this.userId) {
                    this.joinQueue();
                }
            };

            this.ws.onmessage = (event) => {
                if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
                
                try {
                    const message = JSON.parse(event.data);
                    if (this.onMessageCallback) {
                        this.onMessageCallback(message);
                    }
                } catch (error) {
                    console.error('Error al procesar mensaje:', error);
                }
            };

            this.ws.onclose = (event) => {
                console.log('Conexión WebSocket cerrada', event.code, event.reason);
                this.ws = null;
                this.isConnecting = false;
                
                if (event.code !== 1000 && this.connectionAttempts < this.maxConnectionAttempts) {
                    console.log('Intentando reconectar...');
                    setTimeout(() => this.connect(), 1000);
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('Error en WebSocket:', error);
                this.isConnecting = false;
            };
        } catch (error) {
            console.error('Error al crear WebSocket:', error);
            this.isConnecting = false;
            this.ws = null;
        }
    }

    joinQueue() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket no está conectado');
            return;
        }

        if (!this.userId) {
            console.error('User ID no está establecido');
            return;
        }

        console.log('Uniéndose a la cola con userId:', this.userId);
        this.ws.send(JSON.stringify({
            type: 'join',
            userId: this.userId
        }));
    }

    setUserId(userId) {
        if (this.userId === userId) {
            console.log('User ID ya establecido:', userId);
            return;
        }
        console.log('Estableciendo nuevo User ID:', userId);
        this.userId = userId;
    }

    setOnMessageCallback(callback) {
        this.onMessageCallback = callback;
    }

    sendSubmission(roomId) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('No se puede enviar submission: WebSocket no conectado');
            return;
        }
        this.ws.send(JSON.stringify({
            type: 'submission',
            roomId: roomId
        }));
    }

    sendVerdict(roomId, verdict, value) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('No se puede enviar veredicto: WebSocket no conectado');
            return;
        }
        this.ws.send(JSON.stringify({
            type: 'verdict',
            roomId: roomId,
            verdict: verdict,
            value: value
        }));
    }

    disconnect() {
        if (!this.ws) return;

        if (this.ws.readyState === WebSocket.OPEN) {
            console.log('Desconectando WebSocket...');
            this.ws.close(1000, 'Desconexión normal');
        }
        
        this.ws = null;
        this.isConnecting = false;
        this.connectionAttempts = 0;
    }
}

export const arenaService = new ArenaService();

// // Join queue
// {
//     type: 'join',
//     userId: string
//   }
  
//   // Send submission
//   {
//     type: 'submission',
//     roomId: string
//   }
  
//   // Send verdict
//   {
//     type: 'verdict',
//     roomId: string,
//     verdict: string, // 'AC' for accepted, other values for different verdicts
//     value: any // Additional verdict information
//   }


// // Start match
// {
//     type: 'start',
//     roomId: string,
//     problemId: string,
//     opponent: string // opponent's userId
//   }
  
//   // Submission received
//   {
//     type: 'submission',
//     from: string // userId of the sender
//   }
  
//   // Verdict received
//   {
//     type: 'verdict',
//     from: string, // userId of the sender
//     verdict: string,
//     verdict_value: any
//   }
  
//   // Winner announcement
//   {
//     type: 'winner',
//     winner: string // userId of the winner
//   }
  
//   // Opponent disconnected
//   {
//     type: 'opponent_disconnected'
//   }
  
//   // Error messages
//   {
//     type: 'error',
//     message: string
//   }