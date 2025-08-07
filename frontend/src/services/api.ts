import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    console.log('🌐 API: Sending login request for:', username);
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    console.log('📤 API: Form data prepared');
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('📥 API: Response received:', response.status, response.data);
    return response.data;
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
    full_name?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (message: string) => {
    const response = await api.post('/chat/message', { message });
    return response.data;
  },

  getGreeting: async () => {
    const response = await api.get('/chat/greeting');
    return response.data;
  },
};

// Fraud API
export const fraudAPI = {
  getSampleAlerts: async (limit = 10) => {
    const response = await api.get(`/fraud/alerts/sample?limit=${limit}`);
    return response.data;
  },

  getInsights: async () => {
    const response = await api.get('/fraud/insights');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  getUser: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

export default api;
