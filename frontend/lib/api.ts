import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authAPI = {
  register: (data: { email: string; password: string; name: string; accountType: string }) =>
    api.post('/api/v1/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/v1/auth/login', data),
  logout: () => api.post('/api/v1/auth/logout'),
  refresh: () => api.post('/api/v1/auth/refresh'),
  profileSwitch: (profileId: string) =>
    api.post('/api/v1/auth/profile-switch', { profileId }),
};

export const profilesAPI = {
  getAll: () => api.get('/api/v1/profiles'),
  getOne: (id: string) => api.get(`/api/v1/profiles/${id}`),
  create: (data: any) => api.post('/api/v1/profiles', data),
  update: (id: string, data: any) => api.patch(`/api/v1/profiles/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/profiles/${id}`),
};

export const todoAPI = {
  getAll: (profileId?: string) =>
    api.get('/api/v1/todo', { params: { profileId } }),
  getOne: (id: string) => api.get(`/api/v1/todo/${id}`),
  create: (data: any) => api.post('/api/v1/todo', data),
  update: (id: string, data: any) => api.patch(`/api/v1/todo/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/todo/${id}`),
};

export const eventAPI = {
  getAll: (profileId?: string) =>
    api.get('/api/v1/events', { params: { profileId } }),
  getOne: (id: string) => api.get(`/api/v1/events/${id}`),
  create: (data: any) => api.post('/api/v1/events', data),
  update: (id: string, data: any) => api.patch(`/api/v1/events/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/events/${id}`),
};

export const choreAPI = {
  getAll: (profileId?: string) =>
    api.get('/api/v1/chores', { params: { profileId } }),
  getOne: (id: string) => api.get(`/api/v1/chores/${id}`),
  create: (data: any) => api.post('/api/v1/chores', data),
  update: (id: string, data: any) => api.patch(`/api/v1/chores/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/chores/${id}`),
};

export const examAPI = {
  getAll: (profileId?: string) =>
    api.get('/api/v1/exams', { params: { profileId } }),
  getOne: (id: string) => api.get(`/api/v1/exams/${id}`),
  create: (data: any) => api.post('/api/v1/exams', data),
  update: (id: string, data: any) => api.patch(`/api/v1/exams/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/exams/${id}`),
};

export const olympiadAPI = {
  getAll: (profileId?: string) =>
    api.get('/api/v1/olympiad', { params: { profileId } }),
  getOne: (id: string) => api.get(`/api/v1/olympiad/${id}`),
  create: (data: any) => api.post('/api/v1/olympiad', data),
  update: (id: string, data: any) => api.patch(`/api/v1/olympiad/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/olympiad/${id}`),
};

export const homeworkAPI = {
  getAll: (profileId?: string, subject?: string) =>
    api.get('/api/v1/homework', { params: { profileId, subject } }),
  getOne: (id: string) => api.get(`/api/v1/homework/${id}`),
  create: (data: any) => api.post('/api/v1/homework', data),
  update: (id: string, data: any) => api.patch(`/api/v1/homework/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/homework/${id}`),
};

export default api;
