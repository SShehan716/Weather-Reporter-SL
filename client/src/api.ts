import axios from 'axios';
import config from './config';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 