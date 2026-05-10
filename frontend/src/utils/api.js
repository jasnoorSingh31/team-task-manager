import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// Project APIs
export const projectAPI = {
  getAll: () => API.get('/projects'),
  getOne: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
  addMember: (id, data) => API.post(`/projects/${id}/members`, data),
};

// Task APIs
export const taskAPI = {
  getByProject: (projectId) => API.get(`/projects/${projectId}/tasks`),
  getMyTasks: () => API.get('/tasks/my-tasks'),
  getDashboard: () => API.get('/tasks/dashboard'),
  create: (projectId, data) => API.post(`/projects/${projectId}/tasks`, data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
};

export default API;