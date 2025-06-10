import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Base API configuration
const API_BASE_URL = 'http://localhost:8081/a/api';

// Creating axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // If 401 Unauthorized, clear token and redirect to login
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic request function with error handling
export const makeRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);
      throw error;
    }
    toast.error('An unexpected error occurred');
    throw error;
  }
};

// Authentication service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await makeRequest<{ token: string }>({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });
    localStorage.setItem('token', response.token);
    return response;
  },
  
  register: async (branchData: any, userData: any) => {
    return makeRequest({
      method: 'POST',
      url: '/auth/register',
      data: {
        branch: branchData,
        user: userData,
      },
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Dashboard service
export const dashboardService = {
  getStats: () => {
    return makeRequest<{ branches: number, users: number, workouts: number }>({
      method: 'GET',
      url: '/dashboard',
    });
  },
};

// Branch service
export const branchService = {
  getAllBranches: () => {
    return makeRequest<Array<{ id: number, name: string, email: string, location: string }>>({
      method: 'GET',
      url: '/branches',
    });
  },
  
  getBranch: (id: number) => {
    return makeRequest({
      method: 'GET',
      url: `/branches/${id}`,
    });
  },
  
  updateBranch: (id: number, branchData: { name: string, email: string, location: string }) => {
    return makeRequest({
      method: 'PUT',
      url: `/branches/${id}`,
      data: branchData,
    });
  },
  
  deleteBranch: (id: number) => {
    return makeRequest({
      method: 'DELETE',
      url: `/branches/${id}`,
    });
  },
};

// User service
export const userService = {
  getAllUsers: () => {
    return makeRequest<Array<{ id: number, email: string, role: string, branch: { name: string } }>>({
      method: 'GET',
      url: '/users',
    });
  },
  
  getProfile: () => {
    return makeRequest<string>({
      method: 'GET',
      url: '/user/profile',
    });
  },
  
  getUser: (id: number) => {
    return makeRequest({
      method: 'GET',
      url: `/users/${id}`,
    });
  },
  
  updateUser: (id: number, userData: { email: string, role: string, branchId?: number }) => {
    return makeRequest({
      method: 'PUT',
      url: `/users/${id}`,
      data: userData,
    });
  },
  
  deleteUser: (id: number) => {
    return makeRequest({
      method: 'DELETE',
      url: `/users/${id}`,
    });
  },
};

// Workout service
export const workoutService = {
  getAllWorkouts: () => {
    return makeRequest<Array<{ id: number, type: string, duration: number }>>({
      method: 'GET',
      url: '/workouts',
    });
  },
  
  getWorkout: (id: number) => {
    return makeRequest({
      method: 'GET',
      url: `/workouts/${id}`,
    });
  },
  
  addWorkout: (workout: { type: string, duration: number }) => {
    return makeRequest({
      method: 'POST',
      url: '/workouts',
      data: workout,
    });
  },
  
  updateWorkout: (id: number, workout: { type: string, duration: number }) => {
    return makeRequest({
      method: 'PUT',
      url: `/workouts/${id}`,
      data: workout,
    });
  },
  
  deleteWorkout: (id: number) => {
    return makeRequest({
      method: 'DELETE',
      url: `/workouts/${id}`,
    });
  },
};
