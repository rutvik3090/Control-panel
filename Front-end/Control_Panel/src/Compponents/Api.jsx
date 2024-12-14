// /src/services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/users' });

export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const fetchUsers = () => API.get('/');
export const createUser = (data) => API.post('/create', data);
