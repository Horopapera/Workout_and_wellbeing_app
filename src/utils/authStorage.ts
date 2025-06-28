import { dataService } from '../services/dataService';

// Authentication storage utilities for simulated multi-user system
export const AUTH_STORAGE_KEYS = {
  USER_ACCOUNTS: 'fitness_app_user_accounts',
  CURRENT_SESSION: 'fitness_app_current_session'
} as const;

export interface UserAccount {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  profile: any; // User profile data
  createdAt: string;
  lastLoginAt: string;
}

export interface UserSession {
  userId: string;
  email: string;
  loginTime: string;
}

// User accounts management
export const saveUserAccount = (account: UserAccount): void => {
  // This will be replaced by Supabase Auth in Phase 5
  try {
    const accounts = loadAllUserAccounts();
    const existingIndex = accounts.findIndex(acc => acc.id === account.id);
    
    if (existingIndex >= 0) {
      accounts[existingIndex] = account;
    } else {
      accounts.push(account);
    }
    
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(accounts));
  } catch (error) {
    console.warn('Failed to save user account:', error);
  }
};

export const loadAllUserAccounts = (): UserAccount[] => {
  // This will be replaced by Supabase Auth in Phase 5
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER_ACCOUNTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load user accounts:', error);
    return [];
  }
};

export const findUserByEmail = (email: string): UserAccount | null => {
  // This will be replaced by Supabase Auth in Phase 5
  const accounts = loadAllUserAccounts();
  return accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase()) || null;
};

export const findUserById = (id: string): UserAccount | null => {
  // This will be replaced by Supabase Auth in Phase 5
  const accounts = loadAllUserAccounts();
  return accounts.find(acc => acc.id === id) || null;
};

export const validateCredentials = (email: string, password: string): UserAccount | null => {
  // This will be replaced by Supabase Auth in Phase 5
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const emailExists = (email: string): boolean => {
  // This will be replaced by Supabase Auth in Phase 5
  return findUserByEmail(email) !== null;
};

// Session management
export const saveCurrentSession = (session: UserSession): void => {
  // This will be replaced by Supabase Auth in Phase 5
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
  } catch (error) {
    console.warn('Failed to save current session:', error);
  }
};

export const loadCurrentSession = (): UserSession | null => {
  // This will be replaced by Supabase Auth in Phase 5
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.CURRENT_SESSION);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load current session:', error);
    return null;
  }
};

export const clearCurrentSession = (): void => {
  // This will be replaced by Supabase Auth in Phase 5
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.CURRENT_SESSION);
  } catch (error) {
    console.warn('Failed to clear current session:', error);
  }
};

// Development utilities
export const getAllUserAccountsForDev = (): { email: string; id: string; lastLogin: string }[] => {
  // This will be replaced by Supabase Auth in Phase 5
  const accounts = loadAllUserAccounts();
  return accounts.map(acc => ({
    email: acc.email,
    id: acc.id,
    lastLogin: acc.lastLoginAt
  }));
};

export const deleteUserAccount = (userId: string): void => {
  // This will be replaced by Supabase Auth in Phase 5
  try {
    const accounts = loadAllUserAccounts();
    const filteredAccounts = accounts.filter(acc => acc.id !== userId);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(filteredAccounts));
  } catch (error) {
    console.warn('Failed to delete user account:', error);
  }
};

// Migration utilities for Phase 5
export const migrateToSupabaseAuth = async (userId: string): Promise<boolean> => {
  // This will be implemented in Phase 5
  return false;
};