import axios from 'axios';
import { API_URL } from '../config';

// Set up axios with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  signup: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },
  
  validateToken: async () => {
    const response = await api.get('/auth/validate-token');
    return response.data;
  },
  
  getGoogleLoginUrl: async () => {
    const response = await api.get('/oauth2/google/url');
    return response.data;
  },
};

// User service
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },
};

// Medication service
export interface Medication {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  active: boolean;
  userId?: number;
}

export const medicationService = {
  getAll: async () => {
    const response = await api.get('/medications');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/medications/${id}`);
    return response.data;
  },
  
  create: async (medication: Omit<Medication, 'id'>) => {
    const response = await api.post('/medications', medication);
    return response.data;
  },
  
  update: async (id: number, medication: Partial<Medication>) => {
    const response = await api.put(`/medications/${id}`, medication);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/medications/${id}`);
    return response.data;
  },
};

// Reminder service
export interface Reminder {
  id?: number;
  medicationId: number;
  reminderTime: string;
  notes?: string;
  completed: boolean;
  medication?: Medication;
}

export const reminderService = {
  getAll: async () => {
    const response = await api.get('/reminders');
    return response.data;
  },
  
  getPending: async () => {
    const response = await api.get('/reminders/pending');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/reminders/${id}`);
    return response.data;
  },
  
  create: async (reminder: Omit<Reminder, 'id'>) => {
    const response = await api.post('/reminders', reminder);
    return response.data;
  },
  
  update: async (id: number, reminder: Partial<Reminder>) => {
    const response = await api.put(`/reminders/${id}`, reminder);
    return response.data;
  },
  
  markCompleted: async (id: number) => {
    const response = await api.put(`/reminders/${id}/complete`, {});
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  },
};

// Donation service
export interface Donation {
  id?: number;
  medicationName: string;
  quantity: number;
  donationDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  completedDate?: string;
  notes?: string;
}

export const donationService = {
  getAll: async () => {
    const response = await api.get('/donations');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },
  
  create: async (donation: Omit<Donation, 'id'>) => {
    const response = await api.post('/donations', donation);
    return response.data;
  },
  
  update: async (id: number, donation: Partial<Donation>) => {
    const response = await api.put(`/donations/${id}`, donation);
    return response.data;
  },
  
  updateStatus: async (id: number, status: Donation['status']) => {
    const response = await api.put(`/donations/${id}/status`, { status });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/donations/${id}`);
    return response.data;
  },
};

// Family member service
export interface FamilyMember {
  id?: number;
  name: string;
  relationship: string;
  age?: number;
  contactInfo?: string;
  notes?: string;
}

export const familyService = {
  getAll: async () => {
    const response = await api.get('/family');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/family/${id}`);
    return response.data;
  },
  
  create: async (member: Omit<FamilyMember, 'id'>) => {
    const response = await api.post('/family', member);
    return response.data;
  },
  
  update: async (id: number, member: Partial<FamilyMember>) => {
    const response = await api.put(`/family/${id}`, member);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/family/${id}`);
    return response.data;
  },
};

// Analytics service
export interface DashboardAnalytics {
  activeMedicationsCount: number;
  pendingRemindersCount: number;
  adherenceRate: number;
  missedRemindersCount: number;
}

export interface AdherenceAnalytics {
  adherenceByDayOfWeek: Record<string, number>;
  adherenceByTimeOfDay: Record<string, number>;
}

export interface MedicationAnalytics {
  medicationsByStatus: Record<string, number>;
}

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  
  getAdherence: async (days: number = 7) => {
    const response = await api.get(`/analytics/adherence?days=${days}`);
    return response.data;
  },
  
  getMedications: async () => {
    const response = await api.get('/analytics/medications');
    return response.data;
  },
};

// Rewards service
export interface RewardsDashboard {
  totalPoints: number;
  adherencePoints: number;
  currentStreak: number;
  userLevel: number;
  availableRewards: Reward[];
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  isAvailable: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalRequired: number;
  points: number;
  isCompleted: boolean;
}

export const rewardsService = {
  getDashboard: async () => {
    const response = await api.get('/rewards/dashboard');
    return response.data;
  },
  
  getAchievements: async () => {
    const response = await api.get('/rewards/achievements');
    return response.data;
  },
  
  redeemReward: async (rewardId: number) => {
    const response = await api.post(`/rewards/redeem/${rewardId}`);
    return response.data;
  },
};

export default api;
