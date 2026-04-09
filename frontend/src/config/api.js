import axios from 'axios';
import { io } from 'socket.io-client';

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
// Ensure the base URL ALWAYS ends with /api/v1 so it's consistent
if (!API_BASE_URL.endsWith('/api/v1')) {
    API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api/v1';
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        // Fix inconsistent endpoints in the codebase
        // This stops the double /api/v1/api/v1/ errors no matter how the components call it!
        if (config.url) {
            config.url = config.url.replace(/^\/?api\/v1\/?/, '/');
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    auth: (cb) => {
        const token = localStorage.getItem('token');
        cb({ token });
    }
});
