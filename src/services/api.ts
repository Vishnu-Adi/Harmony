import axios from 'axios';

// Set your backend base URL. On macOS (Expo), you might use your LAN IP address for testing.
const api = axios.create({
  baseURL: 'http://172.16.149.139:8000',
});

export default api;