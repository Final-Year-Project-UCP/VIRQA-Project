import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const socket = io('http://localhost:8080', {
    withCredentials: true,
    autoConnect: true
});
