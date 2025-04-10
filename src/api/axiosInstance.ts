// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Ganti dengan URL backend kamu
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}` jika butuh token nanti
  },
});

export default axiosInstance;