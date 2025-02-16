// File: src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://172.16.149.139:8000', //  LAN IP, change as needed
});

// Request interceptor to add the auth token to every request (example)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('user_token'); // Example: 'user_token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;