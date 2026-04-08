import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true
});
