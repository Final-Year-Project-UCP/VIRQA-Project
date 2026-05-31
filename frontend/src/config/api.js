import axios from 'axios';
import { io } from 'socket.io-client';
import { getErrorMessage } from '../utils/errorParser';

export let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Ensure the base URL ALWAYS ends with /api/v1 so it's consistent
if (!API_BASE_URL.endsWith('/api/v1')) {
    API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api/v1';
}

// Derive socket URL from VITE_SOCKET_URL, or fall back to VITE_API_URL (minus /api/v1), or finally localhost
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
                        (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '') : 'http://localhost:8080');

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// ── Request Interceptor ──────────────────────────────────────────────────────
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
    (error) => Promise.reject(error)
);

// ── Response Error Interceptor ───────────────────────────────────────────────
// Normalises every API error so that err.response.data.message always contains
// a friendly, readable string.  All component-level onError handlers that
// already do `err.response?.data?.message || fallback` will automatically
// benefit from this without any changes in those components.
api.interceptors.response.use(
    (response) => response, // pass successful responses straight through
    (error) => {
        if (error.response) {
            // Replace the raw server message with our friendly version
            const friendly = getErrorMessage(error);
            // Mutate the response data so existing reads of
            // err.response.data.message get the friendly string
            if (!error.response.data) error.response.data = {};
            error.response.data.message = friendly;
        }
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
