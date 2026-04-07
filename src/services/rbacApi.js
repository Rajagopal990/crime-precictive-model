import axios from 'axios';

const rbacApi = axios.create({
  baseURL: process.env.REACT_APP_RBAC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 20000,
});

rbacApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('rbac_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default rbacApi;
