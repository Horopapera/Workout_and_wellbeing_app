// Modular data service layer - ready for Supabase migration
// This service abstracts all data operations and can easily swap storage backends

import { 
  User, 
  FoodEntry, 
  PlannedFoodEntry, 
  MealTemplate, 
  Workout, 
  Recipe, 
  WellnessEntry, 
  Food, 
  QuickAddEntry, 
  Notification 
} from '../types';
import { DatabaseTables } from '../types/database';

// Storage interface - can be implemented by localStorage, Supabase, or any other backend
interface DataStorage {
  // User operations
  getUser(userId: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // Food operations
  getFoods(): Promise<Food[]>;
  getCustomFoods(userId: string): Promise<Food[]>;
  saveCustomFood(userId: string, food: Food): Promise<void>;
  updateCustomFood(userId: string, food: Food): Promise<void>;
  deleteCustomFood(userId: string, foodId: string): Promise<void>;

  // Food entry operations
  getFoodEntries(userId: string): Promise<FoodEntry[]>;
  saveFoodEntry(userId: string, entry: FoodEntry): Promise<void>;
  updateFoodEntry(userId: string, entry: FoodEntry): Promise<void>;
  deleteFoodEntry(userId: string, entryId: string): Promise<void>;

  // Planned food entry operations
  getPlannedFoodEntries(userId: string): Promise<PlannedFoodEntry[]>;
  savePlannedFoodEntry(userId: string, entry: PlannedFoodEntry): Promise<void>;
  updatePlannedFoodEntry(userId: string, entry: PlannedFoodEntry): Promise<void>;
  deletePlannedFoodEntry(userId: string, entryId: string): Promise<void>;

  // Meal template operations
  getMealTemplates(userId: string): Promise<MealTemplate[]>;
  saveMealTemplate(userId: string, template: MealTemplate): Promise<void>;
  updateMealTemplate(userId: string, template: MealTemplate): Promise<void>;
  deleteMealTemplate(userId: string, templateId: string): Promise<void>;

  // Workout operations
  getWorkouts(userId: string): Promise<Workout[]>;
  saveWorkout(userId: string, workout: Workout): Promise<void>;
  updateWorkout(userId: string, workout: Workout): Promise<void>;
  deleteWorkout(userId: string, workoutId: string): Promise<void>;

  // Recipe operations
  getRecipes(userId: string): Promise<Recipe[]>;
  saveRecipe(userId: string, recipe: Recipe): Promise<void>;
  updateRecipe(userId: string, recipe: Recipe): Promise<void>;
  deleteRecipe(userId: string, recipeId: string): Promise<void>;

  // Wellness operations
  getWellnessEntries(userId: string): Promise<WellnessEntry[]>;
  saveWellnessEntry(userId: string, entry: WellnessEntry): Promise<void>;
  updateWellnessEntry(userId: string, entry: WellnessEntry): Promise<void>;
  deleteWellnessEntry(userId: string, entryId: string): Promise<void>;

  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  saveNotification(userId: string, notification: Notification): Promise<void>;
  updateNotification(userId: string, notification: Notification): Promise<void>;
  deleteNotification(userId: string, notificationId: string): Promise<void>;

  // Quick add operations
  getQuickAddEntries(userId: string): Promise<QuickAddEntry[]>;
  saveQuickAddEntry(userId: string, entry: QuickAddEntry): Promise<void>;
}

// Configuration for switching between storage backends
interface DataServiceConfig {
  storage: 'localStorage' | 'supabase';
  supabaseUrl?: string;
  supabaseKey?: string;
}

class DataService {
  private storage: DataStorage;
  private config: DataServiceConfig;

  constructor(config: DataServiceConfig) {
    this.config = config;
    
    // Initialize storage based on configuration
    if (config.storage === 'supabase') {
      // Will be implemented in Phase 5
      throw new Error('Supabase storage not yet implemented. Use localStorage for now.');
    } else {
      this.storage = new LocalStorageAdapter();
    }
  }

  // User operations
  async getUser(userId: string): Promise<User | null> {
    try {
      return await this.storage.getUser(userId);
    } catch (error) {
      console.error('Failed to get user:', error);
      throw new DataServiceError('Failed to load user data', error);
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await this.storage.saveUser(user);
    } catch (error) {
      console.error('Failed to save user:', error);
      throw new DataServiceError('Failed to save user data', error);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.storage.deleteUser(userId);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new DataServiceError('Failed to delete user data', error);
    }
  }

  // Food operations
  async getFoods(): Promise<Food[]> {
    try {
      return await this.storage.getFoods();
    } catch (error) {
      console.error('Failed to get foods:', error);
      throw new DataServiceError('Failed to load foods', error);
    }
  }

  async getCustomFoods(userId: string): Promise<Food[]> {
    try {
      return await this.storage.getCustomFoods(userId);
    } catch (error) {
      console.error('Failed to get custom foods:', error);
      throw new DataServiceError('Failed to load custom foods', error);
    }
  }

  async saveCustomFood(userId: string, food: Food): Promise<void> {
    try {
      await this.storage.saveCustomFood(userId, food);
    } catch (error) {
      console.error('Failed to save custom food:', error);
      throw new DataServiceError('Failed to save custom food', error);
    }
  }

  async updateCustomFood(userId: string, food: Food): Promise<void> {
    try {
      await this.storage.updateCustomFood(userId, food);
    } catch (error) {
      console.error('Failed to update custom food:', error);
      throw new DataServiceError('Failed to update custom food', error);
    }
  }

  async deleteCustomFood(userId: string, foodId: string): Promise<void> {
    try {
      await this.storage.deleteCustomFood(userId, foodId);
    } catch (error) {
      console.error('Failed to delete custom food:', error);
      throw new DataServiceError('Failed to delete custom food', error);
    }
  }

  // Food entry operations
  async getFoodEntries(userId: string): Promise<FoodEntry[]> {
    try {
      return await this.storage.getFoodEntries(userId);
    } catch (error) {
      console.error('Failed to get food entries:', error);
      throw new DataServiceError('Failed to load food entries', error);
    }
  }

  async saveFoodEntry(userId: string, entry: FoodEntry): Promise<void> {
    try {
      await this.storage.saveFoodEntry(userId, entry);
    } catch (error) {
      console.error('Failed to save food entry:', error);
      throw new DataServiceError('Failed to save food entry', error);
    }
  }

  async updateFoodEntry(userId: string, entry: FoodEntry): Promise<void> {
    try {
      await this.storage.updateFoodEntry(userId, entry);
    } catch (error) {
      console.error('Failed to update food entry:', error);
      throw new DataServiceError('Failed to update food entry', error);
    }
  }

  async deleteFoodEntry(userId: string, entryId: string): Promise<void> {
    try {
      await this.storage.deleteFoodEntry(userId, entryId);
    } catch (error) {
      console.error('Failed to delete food entry:', error);
      throw new DataServiceError('Failed to delete food entry', error);
    }
  }

  // Planned food entry operations
  async getPlannedFoodEntries(userId: string): Promise<PlannedFoodEntry[]> {
    try {
      return await this.storage.getPlannedFoodEntries(userId);
    } catch (error) {
      console.error('Failed to get planned food entries:', error);
      throw new DataServiceError('Failed to load planned food entries', error);
    }
  }

  async savePlannedFoodEntry(userId: string, entry: PlannedFoodEntry): Promise<void> {
    try {
      await this.storage.savePlannedFoodEntry(userId, entry);
    } catch (error) {
      console.error('Failed to save planned food entry:', error);
      throw new DataServiceError('Failed to save planned food entry', error);
    }
  }

  async updatePlannedFoodEntry(userId: string, entry: PlannedFoodEntry): Promise<void> {
    try {
      await this.storage.updatePlannedFoodEntry(userId, entry);
    } catch (error) {
      console.error('Failed to update planned food entry:', error);
      throw new DataServiceError('Failed to update planned food entry', error);
    }
  }

  async deletePlannedFoodEntry(userId: string, entryId: string): Promise<void> {
    try {
      await this.storage.deletePlannedFoodEntry(userId, entryId);
    } catch (error) {
      console.error('Failed to delete planned food entry:', error);
      throw new DataServiceError('Failed to delete planned food entry', error);
    }
  }

  // Meal template operations
  async getMealTemplates(userId: string): Promise<MealTemplate[]> {
    try {
      return await this.storage.getMealTemplates(userId);
    } catch (error) {
      console.error('Failed to get meal templates:', error);
      throw new DataServiceError('Failed to load meal templates', error);
    }
  }

  async saveMealTemplate(userId: string, template: MealTemplate): Promise<void> {
    try {
      await this.storage.saveMealTemplate(userId, template);
    } catch (error) {
      console.error('Failed to save meal template:', error);
      throw new DataServiceError('Failed to save meal template', error);
    }
  }

  async updateMealTemplate(userId: string, template: MealTemplate): Promise<void> {
    try {
      await this.storage.updateMealTemplate(userId, template);
    } catch (error) {
      console.error('Failed to update meal template:', error);
      throw new DataServiceError('Failed to update meal template', error);
    }
  }

  async deleteMealTemplate(userId: string, templateId: string): Promise<void> {
    try {
      await this.storage.deleteMealTemplate(userId, templateId);
    } catch (error) {
      console.error('Failed to delete meal template:', error);
      throw new DataServiceError('Failed to delete meal template', error);
    }
  }

  // Workout operations
  async getWorkouts(userId: string): Promise<Workout[]> {
    try {
      return await this.storage.getWorkouts(userId);
    } catch (error) {
      console.error('Failed to get workouts:', error);
      throw new DataServiceError('Failed to load workouts', error);
    }
  }

  async saveWorkout(userId: string, workout: Workout): Promise<void> {
    try {
      await this.storage.saveWorkout(userId, workout);
    } catch (error) {
      console.error('Failed to save workout:', error);
      throw new DataServiceError('Failed to save workout', error);
    }
  }

  async updateWorkout(userId: string, workout: Workout): Promise<void> {
    try {
      await this.storage.updateWorkout(userId, workout);
    } catch (error) {
      console.error('Failed to update workout:', error);
      throw new DataServiceError('Failed to update workout', error);
    }
  }

  async deleteWorkout(userId: string, workoutId: string): Promise<void> {
    try {
      await this.storage.deleteWorkout(userId, workoutId);
    } catch (error) {
      console.error('Failed to delete workout:', error);
      throw new DataServiceError('Failed to delete workout', error);
    }
  }

  // Recipe operations
  async getRecipes(userId: string): Promise<Recipe[]> {
    try {
      return await this.storage.getRecipes(userId);
    } catch (error) {
      console.error('Failed to get recipes:', error);
      throw new DataServiceError('Failed to load recipes', error);
    }
  }

  async saveRecipe(userId: string, recipe: Recipe): Promise<void> {
    try {
      await this.storage.saveRecipe(userId, recipe);
    } catch (error) {
      console.error('Failed to save recipe:', error);
      throw new DataServiceError('Failed to save recipe', error);
    }
  }

  async updateRecipe(userId: string, recipe: Recipe): Promise<void> {
    try {
      await this.storage.updateRecipe(userId, recipe);
    } catch (error) {
      console.error('Failed to update recipe:', error);
      throw new DataServiceError('Failed to update recipe', error);
    }
  }

  async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    try {
      await this.storage.deleteRecipe(userId, recipeId);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      throw new DataServiceError('Failed to delete recipe', error);
    }
  }

  // Wellness operations
  async getWellnessEntries(userId: string): Promise<WellnessEntry[]> {
    try {
      return await this.storage.getWellnessEntries(userId);
    } catch (error) {
      console.error('Failed to get wellness entries:', error);
      throw new DataServiceError('Failed to load wellness entries', error);
    }
  }

  async saveWellnessEntry(userId: string, entry: WellnessEntry): Promise<void> {
    try {
      await this.storage.saveWellnessEntry(userId, entry);
    } catch (error) {
      console.error('Failed to save wellness entry:', error);
      throw new DataServiceError('Failed to save wellness entry', error);
    }
  }

  async updateWellnessEntry(userId: string, entry: WellnessEntry): Promise<void> {
    try {
      await this.storage.updateWellnessEntry(userId, entry);
    } catch (error) {
      console.error('Failed to update wellness entry:', error);
      throw new DataServiceError('Failed to update wellness entry', error);
    }
  }

  async deleteWellnessEntry(userId: string, entryId: string): Promise<void> {
    try {
      await this.storage.deleteWellnessEntry(userId, entryId);
    } catch (error) {
      console.error('Failed to delete wellness entry:', error);
      throw new DataServiceError('Failed to delete wellness entry', error);
    }
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      return await this.storage.getNotifications(userId);
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw new DataServiceError('Failed to load notifications', error);
    }
  }

  async saveNotification(userId: string, notification: Notification): Promise<void> {
    try {
      await this.storage.saveNotification(userId, notification);
    } catch (error) {
      console.error('Failed to save notification:', error);
      throw new DataServiceError('Failed to save notification', error);
    }
  }

  async updateNotification(userId: string, notification: Notification): Promise<void> {
    try {
      await this.storage.updateNotification(userId, notification);
    } catch (error) {
      console.error('Failed to update notification:', error);
      throw new DataServiceError('Failed to update notification', error);
    }
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      await this.storage.deleteNotification(userId, notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw new DataServiceError('Failed to delete notification', error);
    }
  }

  // Quick add operations
  async getQuickAddEntries(userId: string): Promise<QuickAddEntry[]> {
    try {
      return await this.storage.getQuickAddEntries(userId);
    } catch (error) {
      console.error('Failed to get quick add entries:', error);
      throw new DataServiceError('Failed to load quick add entries', error);
    }
  }

  async saveQuickAddEntry(userId: string, entry: QuickAddEntry): Promise<void> {
    try {
      await this.storage.saveQuickAddEntry(userId, entry);
    } catch (error) {
      console.error('Failed to save quick add entry:', error);
      throw new DataServiceError('Failed to save quick add entry', error);
    }
  }

  // Utility methods
  async clearAllUserData(userId: string): Promise<void> {
    try {
      await this.storage.deleteUser(userId);
      // Additional cleanup will be handled by the storage implementation
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw new DataServiceError('Failed to clear user data', error);
    }
  }

  // Migration utilities for Phase 5
  async exportUserData(userId: string): Promise<any> {
    try {
      const [
        user,
        foodEntries,
        plannedFoodEntries,
        mealTemplates,
        workouts,
        recipes,
        wellnessEntries,
        customFoods,
        notifications,
        quickAddEntries
      ] = await Promise.all([
        this.getUser(userId),
        this.getFoodEntries(userId),
        this.getPlannedFoodEntries(userId),
        this.getMealTemplates(userId),
        this.getWorkouts(userId),
        this.getRecipes(userId),
        this.getWellnessEntries(userId),
        this.getCustomFoods(userId),
        this.getNotifications(userId),
        this.getQuickAddEntries(userId)
      ]);

      return {
        user,
        foodEntries,
        plannedFoodEntries,
        mealTemplates,
        workouts,
        recipes,
        wellnessEntries,
        customFoods,
        notifications,
        quickAddEntries,
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw new DataServiceError('Failed to export user data', error);
    }
  }
}

// Custom error class for data service operations
class DataServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DataServiceError';
  }
}

// LocalStorage implementation (current)
class LocalStorageAdapter implements DataStorage {
  private getStorageKey(userId: string, dataType: string): string {
    return `fitness_app_${dataType}_${userId}`;
  }

  private async getFromStorage<T>(key: string): Promise<T[]> {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn(`Failed to get data from localStorage for key ${key}:`, error);
      return [];
    }
  }

  private async saveToStorage<T>(key: string, data: T[]): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save data to localStorage for key ${key}:`, error);
      throw error;
    }
  }

  // User operations
  async getUser(userId: string): Promise<User | null> {
    try {
      const data = localStorage.getItem('fitness_app_user_profile');
      if (data) {
        const user = JSON.parse(data);
        return user.id === userId ? user : null;
      }
      return null;
    } catch (error) {
      console.warn('Failed to get user from localStorage:', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      localStorage.setItem('fitness_app_user_profile', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      localStorage.removeItem('fitness_app_user_profile');
      // Clear all user-specific data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes(`_${userId}`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to delete user from localStorage:', error);
      throw error;
    }
  }

  // Food operations
  async getFoods(): Promise<Food[]> {
    // Return built-in foods - these would come from Supabase in Phase 5
    const { allMockFoods } = await import('../data/mockData');
    return allMockFoods;
  }

  async getCustomFoods(userId: string): Promise<Food[]> {
    const key = this.getStorageKey(userId, 'custom_foods');
    return this.getFromStorage<Food>(key);
  }

  async saveCustomFood(userId: string, food: Food): Promise<void> {
    const key = this.getStorageKey(userId, 'custom_foods');
    const foods = await this.getFromStorage<Food>(key);
    foods.push(food);
    await this.saveToStorage(key, foods);
  }

  async updateCustomFood(userId: string, food: Food): Promise<void> {
    const key = this.getStorageKey(userId, 'custom_foods');
    const foods = await this.getFromStorage<Food>(key);
    const index = foods.findIndex(f => f.id === food.id);
    if (index >= 0) {
      foods[index] = food;
      await this.saveToStorage(key, foods);
    }
  }

  async deleteCustomFood(userId: string, foodId: string): Promise<void> {
    const key = this.getStorageKey(userId, 'custom_foods');
    const foods = await this.getFromStorage<Food>(key);
    const filtered = foods.filter(f => f.id !== foodId);
    await this.saveToStorage(key, filtered);
  }

  // Food entry operations
  async getFoodEntries(userId: string): Promise<FoodEntry[]> {
    const key = this.getStorageKey(userId, 'food_entries');
    return this.getFromStorage<FoodEntry>(key);
  }

  async saveFoodEntry(userId: string, entry: FoodEntry): Promise<void> {
    const key = this.getStorageKey(userId, 'food_entries');
    const entries = await this.getFromStorage<FoodEntry>(key);
    entries.push(entry);
    await this.saveToStorage(key, entries);
  }

  async updateFoodEntry(userId: string, entry: FoodEntry): Promise<void> {
    const key = this.getStorageKey(userId, 'food_entries');
    const entries = await this.getFromStorage<FoodEntry>(key);
    const index = entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
      await this.saveToStorage(key, entries);
    }
  }

  async deleteFoodEntry(userId: string, entryId: string): Promise<void> {
    const key = this.getStorageKey(userId, 'food_entries');
    const entries = await this.getFromStorage<FoodEntry>(key);
    const filtered = entries.filter(e => e.id !== entryId);
    await this.saveToStorage(key, filtered);
  }

  // Planned food entry operations
  async getPlannedFoodEntries(userId: string): Promise<PlannedFoodEntry[]> {
    const key = this.getStorageKey(userId, 'planned_food_entries');
    return this.getFromStorage<PlannedFoodEntry>(key);
  }

  async savePlannedFoodEntry(userId: string, entry: PlannedFoodEntry): Promise<void> {
    const key = this.getStorageKey(userId, 'planned_food_entries');
    const entries = await this.getFromStorage<PlannedFoodEntry>(key);
    entries.push(entry);
    await this.saveToStorage(key, entries);
  }

  async updatePlannedFoodEntry(userId: string, entry: PlannedFoodEntry): Promise<void> {
    const key = this.getStorageKey(userId, 'planned_food_entries');
    const entries = await this.getFromStorage<PlannedFoodEntry>(key);
    const index = entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
      await this.saveToStorage(key, entries);
    }
  }

  async deletePlannedFoodEntry(userId: string, entryId: string): Promise<void> {
    const key = this.getStorageKey(userId, 'planned_food_entries');
    const entries = await this.getFromStorage<PlannedFoodEntry>(key);
    const filtered = entries.filter(e => e.id !== entryId);
    await this.saveToStorage(key, filtered);
  }

  // Meal template operations
  async getMealTemplates(userId: string): Promise<MealTemplate[]> {
    const key = this.getStorageKey(userId, 'meal_templates');
    return this.getFromStorage<MealTemplate>(key);
  }

  async saveMealTemplate(userId: string, template: MealTemplate): Promise<void> {
    const key = this.getStorageKey(userId, 'meal_templates');
    const templates = await this.getFromStorage<MealTemplate>(key);
    templates.push(template);
    await this.saveToStorage(key, templates);
  }

  async updateMealTemplate(userId: string, template: MealTemplate): Promise<void> {
    const key = this.getStorageKey(userId, 'meal_templates');
    const templates = await this.getFromStorage<MealTemplate>(key);
    const index = templates.findIndex(t => t.id === template.id);
    if (index >= 0) {
      templates[index] = template;
      await this.saveToStorage(key, templates);
    }
  }

  async deleteMealTemplate(userId: string, templateId: string): Promise<void> {
    const key = this.getStorageKey(userId, 'meal_templates');
    const templates = await this.getFromStorage<MealTemplate>(key);
    const filtered = templates.filter(t => t.id !== templateId);
    await this.saveToStorage(key, filtered);
  }

  // Workout operations
  async getWorkouts(userId: string): Promise<Workout[]> {
    const key = this.getStorageKey(userId, 'workouts');
    return this.getFromStorage<Workout>(key);
  }

  async saveWorkout(userId: string, workout: Workout): Promise<void> {
    const key = this.getStorageKey(userId, 'workouts');
    const workouts = await this.getFromStorage<Workout>(key);
    workouts.push(workout);
    await this.saveToStorage(key, workouts);
  }

  async updateWorkout(userId: string, workout: Workout): Promise<void> {
    const key = this.getStorageKey(userId, 'workouts');
    const workouts = await this.getFromStorage<Workout>(key);
    const index = workouts.findIndex(w => w.id === workout.id);
    if (index >= 0) {
      workouts[index] = workout;
      await this.saveToStorage(key, workouts);
    }
  }

  async deleteWorkout(userId: string, workoutId: string): Promise<void> {
    const key = this.getStorageKey(userId, 'workouts');
    const workouts = await this.getFromStorage<Workout>(key);
    const filtered = workouts.filter(w => w.id !== workoutId);
    await this.saveToStorage(key, filtered);
  }

  // Recipe operations
  async getRecipes(userId: string): Promise<Recipe[]> {
    const key = this.getStorageKey(userId, 'recipes');
    return this.getFromStorage<Recipe>(key);
  }

  async saveRecipe(userId: string, recipe: Recipe): Promise<void> {
    const key = this.getStorageKey(userId, 'recipes');
    const recipes = await this.getFromStorage<Recipe>(key);
    recipes.push(recipe);
    await this.saveToStorage(key, recipes);
  }

  async updateRecipe(userId: string, recipe: Recipe): Promise<void> {
    const key = this.getStorageKey(userId, 'recipes');
    const recipes = await this.getFromStorage<Recipe>(key);
    const index = recipes.findIndex(r => r.id === recipe.id);
    if (index >= 0) {
      recipes[index] = recipe;
      await this.saveToStorage(key, recipes);
    }
  }

  async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    const key = this.getStorageKey(userId, 'recipes');
    const recipes = await this.getFromStorage<Recipe>(key);
    const filtered = recipes.filter(r => r.id !== recipeId);
    await this.saveToStorage(key, filtered);
  }

  // Wellness operations
  async getWellnessEntries(userId: string): Promise<WellnessEntry[]> {
    const key = this.getStorageKey(userId, 'wellness_entries');
    return this.getFromStorage<WellnessEntry>(key);
  }

  async saveWellnessEntry(userId: string, entry: WellnessEntry): Promise<void> {
    const key = this.getStorageKey(userId, 'wellness_entries');
    const entries = await this.getFromStorage<WellnessEntry>(key);
    entries.push(entry);
    await this.saveToStorage(key, entries);
  }

  async updateWellnessEntry(userId: string, entry: WellnessEntry): Promise<void> {
    const key = this.getStorageKey(userId, 'wellness_entries');
    const entries = await this.getFromStorage<WellnessEntry>(key);
    const index = entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
      await this.saveToStorage(key, entries);
    }
  }

  async deleteWellnessEntry(userId: string, entryId: string): Promise<void> {
    const key = this.getStorageKey(userId, 'wellness_entries');
    const entries = await this.getFromStorage<WellnessEntry>(key);
    const filtered = entries.filter(e => e.id !== entryId);
    await this.saveToStorage(key, filtered);
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    const key = this.getStorageKey(userId, 'notifications');
    return this.getFromStorage<Notification>(key);
  }

  async saveNotification(userId: string, notification: Notification): Promise<void> {
    const key = this.getStorageKey(userId, 'notifications');
    const notifications = await this.getFromStorage<Notification>(key);
    notifications.unshift(notification); // Add to beginning for chronological order
    await this.saveToStorage(key, notifications);
  }

  async updateNotification(userId: string, notification: Notification): Promise<void> {
    const key = this.getStorageKey(userId, 'notifications');
    const notifications = await this.getFromStorage<Notification>(key);
    const index = notifications.findIndex(n => n.id === notification.id);
    if (index >= 0) {
      notifications[index] = notification;
      await this.saveToStorage(key, notifications);
    }
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const key = this.getStorageKey(userId, 'notifications');
    const notifications = await this.getFromStorage<Notification>(key);
    const filtered = notifications.filter(n => n.id !== notificationId);
    await this.saveToStorage(key, filtered);
  }

  // Quick add operations
  async getQuickAddEntries(userId: string): Promise<QuickAddEntry[]> {
    const key = this.getStorageKey(userId, 'quick_add_entries');
    return this.getFromStorage<QuickAddEntry>(key);
  }

  async saveQuickAddEntry(userId: string, entry: QuickAddEntry): Promise<void> {
    const key = this.getStorageKey(userId, 'quick_add_entries');
    const entries = await this.getFromStorage<QuickAddEntry>(key);
    entries.push(entry);
    await this.saveToStorage(key, entries);
  }
}

// Export singleton instance
export const dataService = new DataService({
  storage: 'localStorage' // Will be configurable in Phase 5
});

export { DataService, DataServiceError };
export type { DataStorage, DataServiceConfig };