import axios from 'axios';

const API = axios.create({
  baseURL: 'https://nasfat-backend.vercel.app',
});

const AdminAPI = axios.create({
  baseURL: 'https://nasfat-backend.vercel.app',
});

// Interceptor for Client/Regular API
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Interceptor for Admin API
AdminAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export { AdminAPI, API };
