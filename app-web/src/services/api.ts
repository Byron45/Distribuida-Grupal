import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8089',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (!error.response) {
            console.error('Error de red: No se pudo conectar con el Gateway (Traefik).');
            return Promise.reject(new Error('El servicio no está disponible temporalmente.'));
        }

        if (error.response.status === 503 || error.response.status === 504) {
            console.error('Servicio caído o Circuit Breaker activado:', error.response.status);
        }

        return Promise.reject(error);
    }
);

export default api;