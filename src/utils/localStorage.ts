// Local storage utilities for user profile management
export const STORAGE_KEYS = {
  USER_PROFILE: 'fitness_app_user_profile',
  APP_DATA: 'fitness_app_data'
} as const;

export interface StoredAppData {
  foodEntries: any[];
  plannedFoodEntries: any[];
  mealTemplates: any[];
  workouts: any[];
  recipes: any[];
  wellnessEntries: any[];
  customFoods: any[];
  quickAddEntries: any[];
  notifications: any[];
}

// User profile storage
export const saveUserProfile = (userProfile: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  } catch (error) {
    console.warn('Failed to save user profile to localStorage:', error);
  }
};

export const loadUserProfile = (): any | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load user profile from localStorage:', error);
    return null;
  }
};

export const clearUserProfile = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (error) {
    console.warn('Failed to clear user profile from localStorage:', error);
  }
};

// App data storage (scoped to user)
export const saveAppData = (userId: string, data: StoredAppData): void => {
  try {
    const key = `${STORAGE_KEYS.APP_DATA}_${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save app data to localStorage:', error);
  }
};

export const loadAppData = (userId: string): StoredAppData | null => {
  try {
    const key = `${STORAGE_KEYS.APP_DATA}_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load app data from localStorage:', error);
    return null;
  }
};

export const clearAppData = (userId: string): void => {
  try {
    const key = `${STORAGE_KEYS.APP_DATA}_${userId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear app data from localStorage:', error);
  }
};

export const clearAllUserData = (): void => {
  try {
    // Clear user profile
    clearUserProfile();
    
    // Clear all app data (find all keys that start with our app data prefix)
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.APP_DATA)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear all user data from localStorage:', error);
  }
};