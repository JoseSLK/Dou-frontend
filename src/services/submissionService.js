/**
 * Servicio que gestiona las entregas de código y sus intentos.
 * Permite enviar soluciones y consultar el historial de intentos de los usuarios.
 */
import { API_URL } from '../config/constants';

export const submissionService = {
    submitCode: async (formData) => {
        const response = await fetch(`${API_URL}/submission/`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al enviar el código');
        }

        return response.json();
    },

    getSubmissionAttempts: async (userId, problemId) => {
        const response = await fetch(`${API_URL}/submission/attemps`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, problem_id: problemId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getUserSubmissions: async (userId) => {
        const response = await fetch(`${API_URL}/submission/user/${userId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
};