import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://10.55.46.97:8000/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;