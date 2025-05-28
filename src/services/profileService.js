import { API_URL } from '../config/constants';

export const profileService = {
    updateUserProfile: async (userId, userData, token) => {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userData),
        });

        if (response.status === 401) {
            throw new Error("Tu contraseña actual es incorrecta, por favor intenta de nuevo");
        }

        if (!response.ok) {
            let errorMessage = "Error al actualizar el perfil";
            try {
                const errorData = await response.text();
                errorMessage = errorData || errorMessage;
            } catch (e) {
                console.error("Error al parsear la respuesta:", e);
            }
            throw new Error(errorMessage);
        }

        return response;
    },

    updateUserPassword: async (userId, passwordData, token) => {
        const response = await fetch(`${API_URL}/user/${userId}/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(passwordData),
        });

        if (response.status === 401) {
            throw new Error("Tu contraseña actual es incorrecta, por favor intenta de nuevo");
        }

        if (!response.ok) {
            let errorMessage = "Error al cambiar la contraseña";
            try {
                const errorData = await response.text();
                errorMessage = errorData || errorMessage;
            } catch (e) {
                console.error("Error al parsear la respuesta:", e);
            }
            throw new Error(errorMessage);
        }

        return response;
    },

    deleteUserAccount: async (userId, token) => {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            throw new Error("Tu identidad tiene problemas, por favor intenta iniciar sesión nuevamente");
        }

        if (!response.ok) {
            let errorMessage = "Error al eliminar la cuenta";
            try {
                const errorData = await response.text();
                errorMessage = errorData || errorMessage;
            } catch (e) {
                console.error("Error al parsear la respuesta:", e);
            }
            throw new Error(errorMessage);
        }

        return response;
    }
};