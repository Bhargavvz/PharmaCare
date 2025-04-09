// API URL configuration
// Use window._env_ for runtime environment variables or fallback to a default
declare global {
  interface Window {
    _env_?: {
      REACT_APP_API_URL?: string;
    };
  }
}

export const API_URL = window._env_?.REACT_APP_API_URL || 'http://localhost:8080/api';

// Other configuration constants
export const APP_NAME = 'PharmaCare+';
export const APP_VERSION = '1.0.0';

// Feature flags
export const FEATURES = {
  ENABLE_DONATIONS: true,
  ENABLE_FAMILY_MANAGEMENT: true,
  ENABLE_REWARDS: true,
  ENABLE_ANALYTICS: true,
};

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;

// Date format settings
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Theme settings
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Language settings
export const LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
};

// Default settings
export const DEFAULT_SETTINGS = {
  THEME: THEMES.LIGHT,
  LANGUAGE: LANGUAGES.ENGLISH,
  NOTIFICATIONS_ENABLED: true,
};

// Notification settings
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MEDICATIONS: '/dashboard/medications',
  REMINDERS: '/dashboard/reminders',
  DONATIONS: '/dashboard/donations',
  FAMILY: '/dashboard/family',
  ANALYTICS: '/dashboard/analytics',
  REWARDS: '/dashboard/rewards',
  SETTINGS: '/dashboard/settings',
  PROFILE: '/dashboard/profile',
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again later.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  SIGNUP: 'Account created successfully!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  MEDICATION_ADDED: 'Medication added successfully!',
  MEDICATION_UPDATED: 'Medication updated successfully!',
  MEDICATION_DELETED: 'Medication deleted successfully!',
  REMINDER_ADDED: 'Reminder added successfully!',
  REMINDER_UPDATED: 'Reminder updated successfully!',
  REMINDER_DELETED: 'Reminder deleted successfully!',
  REMINDER_COMPLETED: 'Reminder marked as completed!',
  DONATION_ADDED: 'Donation added successfully!',
  DONATION_UPDATED: 'Donation updated successfully!',
  DONATION_DELETED: 'Donation deleted successfully!',
  FAMILY_MEMBER_ADDED: 'Family member added successfully!',
  FAMILY_MEMBER_UPDATED: 'Family member updated successfully!',
  FAMILY_MEMBER_DELETED: 'Family member deleted successfully!',
  REWARD_REDEEMED: 'Reward redeemed successfully!',
};
