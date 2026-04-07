import axios from 'axios';

const resolveDefaultApiBaseUrl = () => {
  return '/api/v1';
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || resolveDefaultApiBaseUrl(),
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crime_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('crime_jwt');
    }
    return Promise.reject(error);
  }
);

export default api;
