/**
 * Servicio que maneja las operaciones CRUD de ejercicios.
 * Permite crear, obtener y buscar ejercicios del sistema.
 */
import { API_URL } from '../config/constants';

export const exerciseService = {
    createProblem: async (formData) => {
        const response = await fetch(`${API_URL}/problem/`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al crear el ejercicio');
        }

        return response.json();
    },

    getAllExercises: async () => {
        const response = await fetch(`${API_URL}/problem/`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorMsg = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMsg);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Formato de datos inesperado recibido del servidor.');
        }

        return data;
    },

    getExerciseById: async (problemId) => {
        if (!problemId) return null;

        const response = await fetch(`${API_URL}/problem/${problemId}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error fetching exercise data');
        }

        return response.json();
    }
};