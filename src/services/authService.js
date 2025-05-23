import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const authService = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/user/`, userData);
            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data?.message || 'Error en el registro'
                };
            } else if (error.request) {
                throw {
                    status: 0,
                    message: 'No se pudo conectar con el servidor'
                };
            } else {
                throw {
                    status: 0,
                    message: 'Error al procesar la petición'
                };
            }
        }
    }
}; 