import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost';

function attachInterceptor(instance: ReturnType<typeof axios.create>) {
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (!error.response) {
                console.error('Error de red: no se pudo conectar con el Gateway (Traefik).');
                return Promise.reject(new Error('El servicio no está disponible temporalmente.'));
            }
            if (error.response.status === 503 || error.response.status === 504) {
                console.error('Servicio caído o Circuit Breaker activado:', error.response.status);
                return Promise.reject(new Error('El servicio no está disponible (circuit breaker).'));
            }
            if (error.response.status === 400 && error.response.data) {
                const msg = typeof error.response.data === 'string'
                    ? error.response.data
                    : (error.response.data.message || 'Solicitud inválida');
                return Promise.reject(new Error(msg));
            }
            return Promise.reject(error);
        }
    );
    return instance;
}

export const authorsApi = attachInterceptor(axios.create({
    baseURL: `${GATEWAY_URL}/app-authors`,
    headers: {'Content-Type': 'application/json'},
}));

export const booksApi = attachInterceptor(axios.create({
    baseURL: `${GATEWAY_URL}/app-books`,
    headers: {'Content-Type': 'application/json'},
}));

export const customersApi = attachInterceptor(axios.create({
    baseURL: `${GATEWAY_URL}/app-customers`,
    headers: {'Content-Type': 'application/json'},
}));