import axios from 'axios';
import type { Service, Booking, CreateBookingRequest, ApiResponse } from '../types';

// In production, use relative URL (same server). In development, use VITE_API_URL or localhost
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await api.get<ApiResponse<Service[]>>('/services');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch services');
  },
};

export const bookingsApi = {
  create: async (booking: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', booking);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create booking');
  },
  search: async (bookingNumber?: string, phone?: string): Promise<Booking> => {
    const params = new URLSearchParams();
    if (bookingNumber) params.append('bookingNumber', bookingNumber);
    if (phone) params.append('phone', phone);
    const response = await api.get<ApiResponse<Booking>>(`/bookings/search?${params}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Booking not found');
  },
};

export const slotsApi = {
  getAvailable: async (date: string, serviceId: number): Promise<{ time: string }[]> => {
    const response = await api.get<ApiResponse<{ time: string }[]>>(
      `/slots?date=${date}&serviceId=${serviceId}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch slots');
  },
};

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post<ApiResponse<{ token: string; user: any }>>('/auth/login', {
      username,
      password,
    });
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    }
    throw new Error(response.data.error || 'Login failed');
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export const adminApi = {
  getPendingPayments: async (): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>('/admin/pending-payments');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch pending payments');
  },
  verifyPayment: async (bookingId: number, paymentMethod?: string, notes?: string) => {
    const response = await api.post<ApiResponse<any>>('/admin/verify-payment', {
      bookingId,
      paymentMethod,
      notes,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to verify payment');
  },
  getQueue: async (): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>('/admin/queue');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch queue');
  },
  updateStatus: async (bookingId: number, status: string, notes?: string) => {
    const response = await api.put<ApiResponse<any>>('/admin/update-status', {
      bookingId,
      status,
      notes,
    });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to update status');
  },
  getCustomerHistory: async () => {
    const response = await api.get<ApiResponse<any[]>>('/admin/records/customers');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch customer history');
  },
  getServiceRecords: async (limit = 100, offset = 0) => {
    const response = await api.get<ApiResponse<any>>(`/admin/records/services?limit=${limit}&offset=${offset}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to fetch service records');
  },
  getDailyStats: async (days = 30) => {
    const response = await api.get<ApiResponse<any[]>>(`/admin/stats/daily?days=${days}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch daily stats');
  },
  getOverallStats: async () => {
    const response = await api.get<ApiResponse<any>>('/admin/stats/overall');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch overall stats');
  },
  getCustomerRecords: async (phone: string) => {
    const response = await api.get<ApiResponse<Booking[]>>(`/admin/records/customer/${phone}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch customer records');
  },
};

export const locationApi = {
  getLocation: async () => {
    const response = await api.get<ApiResponse<any>>('/slots/location');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch location');
  },
};

export default api;

