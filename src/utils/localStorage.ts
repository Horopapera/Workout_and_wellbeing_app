import { dataService } from '../services/dataService';

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
  // This will be replaced by dataService in Phase 5
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  } catch (error) {
    console.warn('Failed to save user profile to localStorage:', error);
  }
};

export const loadUserProfile = (): any | null => {
  // This will be replaced by dataService in Phase 5
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load user profile from localStorage:', error);
    return null;
  }
};

export const clearUserProfile = (): void => {
  // This will be replaced by dataService in Phase 5
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (error) {
    console.warn('Failed to clear user profile from localStorage:', error);
  }
};

// App data storage (scoped to user)
export const saveAppData = (userId: string, data: StoredAppData): void => {
  // This will be replaced by dataService in Phase 5
  try {
    const key = `${STORAGE_KEYS.APP_DATA}_${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save app data to localStorage:', error);
  }
};

export const loadAppData = (userId: string): StoredAppData | null => {
  // This will be replaced by dataService in Phase 5
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
  // This will be replaced by dataService in Phase 5
  try {
    const key = `${STORAGE_KEYS.APP_DATA}_${userId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear app data from localStorage:', error);
  }
};

export const clearAllUserData = (): void => {
  // This will be replaced by dataService in Phase 5
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

// Migration utilities for Phase 5
export const migrateToDataService = async (userId: string): Promise<boolean> => {
  try {
    // Load user profile
    const userProfile = loadUserProfile();
    if (!userProfile || userProfile.id !== userId) {
      return false;
    }

    // Load app data
    const appData = loadAppData(userId);
    if (!appData) {
      return false;
    }

    // Save user profile to data service
    await dataService.saveUser(userProfile);

    // Save all app data to data service
    const {
      foodEntries,
      plannedFoodEntries,
      mealTemplates,
      workouts,
      recipes,
      wellnessEntries,
      customFoods,
      notifications,
      quickAddEntries
    } = appData;

    // Save all data in parallel
    await Promise.all([
      // Save custom foods
      ...customFoods.map(food => dataService.saveCustomFood(userId, food)),
      
      // Save food entries
      ...foodEntries.map(entry => dataService.saveFoodEntry(userId, entry)),
      
      // Save planned food entries
      ...plannedFoodEntries.map(entry => dataService.savePlannedFoodEntry(userId, entry)),
      
      // Save meal templates
      ...mealTemplates.map(template => dataService.saveMealTemplate(userId, template)),
      
      // Save workouts
      ...workouts.map(workout => dataService.saveWorkout(userId, workout)),
      
      // Save recipes
      ...recipes.map(recipe => dataService.saveRecipe(userId, recipe)),
      
      // Save wellness entries
      ...wellnessEntries.map(entry => dataService.saveWellnessEntry(userId, entry)),
      
      // Save notifications
      ...notifications.map(notification => dataService.saveNotification(userId, notification)),
      
      // Save quick add entries
      ...quickAddEntries.map(entry => dataService.saveQuickAddEntry(userId, entry))
    ]);

    return true;
  } catch (error) {
    console.error('Failed to migrate to data service:', error);
    return false;
  }
};