/**
 * Servicio de autenticación que maneja el registro, login y validación de tokens.
 * Gestiona todas las operaciones relacionadas con la autenticación de usuarios.
 */
import { API_URL } from '../config/constants';

export const authService = {
    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/user/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: await response.text()
                };
            }

            return {
                status: response.status,
                data: await response.json()
            };
        } catch (error) {
            throw {
                status: error.status || 0,
                message: error.message || 'Error en el registro'
            };
        }
    },

    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    user_password: password
                })
            });

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: 'Error de autenticación'
                };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw {
                status: error.status || 0,
                message: error.message || 'Error de conexión'
            };
        }
    },

    validateToken: async (token) => {
        try {
            const response = await fetch(`${API_URL}/auth/validate`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: 'Sesión inválida'
                };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw {
                status: error.status || 0,
                message: error.message || 'Error al validar la sesión'
            };
        }
    }
};