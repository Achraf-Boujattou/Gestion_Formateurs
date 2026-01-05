import axios from 'axios';

// Base configuration for axios
const api = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to add Authorization token to every request
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle common errors (401, 403, 500)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Unauthorized - clear session and redirect to login
            if (error.response.status === 401) {
                sessionStorage.clear();
                window.location.href = '/login';
            }

            // For other errors, we can centralize the extraction of error message
            const message = error.response.data?.Error || error.response.data?.Message || "Une erreur est survenue.";
            error.userMessage = message;
        } else {
            error.userMessage = "Impossible de contacter le serveur backend.";
        }
        return Promise.reject(error);
    }
);

export default api;
