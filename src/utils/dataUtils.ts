// Data utilities for transforming between app and database models
// These will be used in Phase 5 when migrating to Supabase

import {
  User,
  FoodEntry,
  PlannedFoodEntry,
  Workout,
  Recipe,
  Food,
  QuickAddEntry,
  Notification
} from '../types';
import {
  DatabaseUser,
  DatabaseFood,
  DatabaseFoodEntry,
  DatabasePlannedFoodEntry,
  DatabaseNotification,
  DatabaseQuickAddEntry
} from '../types/database';

/**
 * Transform app model to database model
 * These functions are used to convert between app models and database models
 */
export const transformers = {
  // User transformers
  userToDatabase(user: User): DatabaseUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      goal: user.goal,
      target_weight: user.targetWeight,
      current_weight: user.currentWeight,
      height: user.height,
      age: user.age,
      gender: user.gender,
      activity_level: user.activityLevel,
      dietary_preferences: user.dietaryPreferences,
      workout_style: user.workoutStyle,
      daily_calories: user.dailyCalories,
      macro_targets: user.macroTargets,
      custom_macro_goals: user.customMacroGoals,
      preferences: user.preferences || {
        notifications: {
          workouts: true,
          meals: true,
          water: true,
          reminders: true
        },
        units: 'metric',
        theme: 'light'
      },
      onboarding_completed: user.onboardingCompleted,
      created_at: user.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: user.lastLoginAt
    };
  },

  userFromDatabase(dbUser: DatabaseUser): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar,
      goal: dbUser.goal,
      targetWeight: dbUser.target_weight,
      currentWeight: dbUser.current_weight,
      height: dbUser.height,
      age: dbUser.age,
      gender: dbUser.gender,
      activityLevel: dbUser.activity_level,
      dietaryPreferences: dbUser.dietary_preferences,
      workoutStyle: dbUser.workout_style,
      dailyCalories: dbUser.daily_calories,
      macroTargets: dbUser.macro_targets,
      customMacroGoals: dbUser.custom_macro_goals,
      preferences: dbUser.preferences,
      onboardingCompleted: dbUser.onboarding_completed,
      createdAt: dbUser.created_at,
      lastLoginAt: dbUser.last_login_at
    };
  },

  // Food transformers
  foodToDatabase(food: Food): DatabaseFood {
    return {
      id: food.id,
      name: food.name,
      brand: food.brand,
      barcode: food.barcode,
      calories_per_100g: food.caloriesPer100g,
      protein_per_100g: food.proteinPer100g,
      carbs_per_100g: food.carbsPer100g,
      fat_per_100g: food.fatPer100g,
      category: food.category,
      is_custom: food.isCustom || false,
      created_by: food.createdBy,
      usage_count: food.usageCount || 0,
      last_used: food.lastUsed,
      created_at: food.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  foodFromDatabase(dbFood: DatabaseFood): Food {
    return {
      id: dbFood.id,
      name: dbFood.name,
      brand: dbFood.brand,
      barcode: dbFood.barcode,
      caloriesPer100g: dbFood.calories_per_100g,
      proteinPer100g: dbFood.protein_per_100g,
      carbsPer100g: dbFood.carbs_per_100g,
      fatPer100g: dbFood.fat_per_100g,
      category: dbFood.category,
      isCustom: dbFood.is_custom,
      createdBy: dbFood.created_by,
      usageCount: dbFood.usage_count,
      lastUsed: dbFood.last_used,
      createdAt: dbFood.created_at
    };
  },

  // Food entry transformers
  foodEntryToDatabase(entry: FoodEntry, userId: string): DatabaseFoodEntry {
    return {
      id: entry.id,
      user_id: userId,
      food_id: entry.foodId,
      amount: entry.amount,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      meal_type: entry.mealType,
      date: entry.date,
      created_at: entry.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  // Food entry transformers
  foodEntryFromDatabase(dbEntry: DatabaseFoodEntry, food: Food): FoodEntry {
    return {
      id: dbEntry.id,
      foodId: dbEntry.food_id,
      food,
      amount: dbEntry.amount,
      calories: dbEntry.calories,
      protein: dbEntry.protein,
      carbs: dbEntry.carbs,
      fat: dbEntry.fat,
      mealType: dbEntry.meal_type,
      date: dbEntry.date,
      createdAt: dbEntry.created_at
    };
  },
  
  // Planned food entry transformers
  plannedFoodEntryToDatabase(entry: PlannedFoodEntry, userId: string): DatabasePlannedFoodEntry {
    return {
      id: entry.id,
      user_id: userId,
      food_id: entry.foodId,
      amount: entry.amount,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      meal_type: entry.mealType,
      date: entry.date,
      created_at: entry.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },
  
  plannedFoodEntryFromDatabase(dbEntry: DatabasePlannedFoodEntry, food: Food): PlannedFoodEntry {
    return {
      id: dbEntry.id,
      foodId: dbEntry.food_id,
      food,
      amount: dbEntry.amount,
      calories: dbEntry.calories,
      protein: dbEntry.protein,
      carbs: dbEntry.carbs,
      fat: dbEntry.fat,
      mealType: dbEntry.meal_type,
      date: dbEntry.date,
      createdAt: dbEntry.created_at
    };
  },
  
  // Notification transformers
  notificationToDatabase(notification: Notification, userId: string): DatabaseNotification {
    return {
      id: notification.id,
      user_id: userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      action_url: notification.actionUrl,
      created_at: notification.timestamp || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },
  
  notificationFromDatabase(dbNotification: DatabaseNotification): Notification {
    return {
      id: dbNotification.id,
      type: dbNotification.type,
      title: dbNotification.title,
      message: dbNotification.message,
      read: dbNotification.read,
      actionUrl: dbNotification.action_url,
      timestamp: dbNotification.created_at
    };
  },
  
  // Quick add entry transformers
  quickAddEntryToDatabase(entry: QuickAddEntry, userId: string): DatabaseQuickAddEntry {
    return {
      id: entry.id,
      user_id: userId,
      name: entry.name,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      meal_type: entry.mealType,
      date: entry.date,
      created_at: entry.createdAt || new Date().toISOString()
    };
  },
  
  quickAddEntryFromDatabase(dbEntry: DatabaseQuickAddEntry): QuickAddEntry {
    return {
      id: dbEntry.id,
      name: dbEntry.name,
      calories: dbEntry.calories,
      protein: dbEntry.protein,
      carbs: dbEntry.carbs,
      fat: dbEntry.fat,
      mealType: dbEntry.meal_type,
      date: dbEntry.date,
      createdAt: dbEntry.created_at
    };
  }
};

/**
 * Data validation utilities
 * These will be used to validate data before saving to the database
 */
export const validators = {
  // User validation
  validateUser(user: User): boolean {
    if (!user.id || !user.email || !user.name) {
      return false;
    }
    
    if (!user.goal || !['lose', 'gain', 'maintain'].includes(user.goal)) {
      return false;
    }
    
    if (!user.currentWeight || !user.height || !user.age) {
      return false;
    }
    
    if (!user.gender || !['male', 'female', 'other'].includes(user.gender)) {
      return false;
    }
    
    if (!user.activityLevel || 
        !['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(user.activityLevel)) {
      return false;
    }
    
    if (!user.dailyCalories || !user.macroTargets) {
      return false;
    }
    
    return true;
  },

  // Food validation
  validateFood(food: Food): boolean {
    if (!food.id || !food.name) {
      return false;
    }
    
    if (food.caloriesPer100g < 0 || food.proteinPer100g < 0 || 
        food.carbsPer100g < 0 || food.fatPer100g < 0) {
      return false;
    }
    
    if (!food.category) {
      return false;
    }
    
    return true;
  },

  // Food entry validation
  validateFoodEntry(entry: FoodEntry): boolean {
    if (!entry.id || !entry.foodId) {
      return false;
    }
    
    if (!entry.amount || entry.amount <= 0) {
      return false;
    }
    
    if (!entry.mealType || 
        !['breakfast', 'lunch', 'dinner', 'snack'].includes(entry.mealType)) {
      return false;
    }
    
    if (!entry.date) {
      return false;
    }
    
    return true;
  },

  // Planned food entry validation
  validatePlannedFoodEntry(entry: PlannedFoodEntry): boolean {
    if (!entry.id || !entry.foodId) {
      return false;
    }
    
    if (!entry.amount || entry.amount <= 0) {
      return false;
    }
    
    if (!entry.mealType || 
        !['breakfast', 'lunch', 'dinner', 'snack'].includes(entry.mealType)) {
      return false;
    }
    
    if (!entry.date) {
      return false;
    }
    
    return true;
  },
  
  // Workout validation
  validateWorkout(workout: Workout): boolean {
    if (!workout.id || !workout.name) {
      return false;
    }
    
    if (!workout.exercises || workout.exercises.length === 0) {
      return false;
    }
    
    return true;
  },
  
  // Recipe validation
  validateRecipe(recipe: Recipe): boolean {
    if (!recipe.id || !recipe.name) {
      return false;
    }
    
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return false;
    }
    
    if (!recipe.servings || recipe.servings <= 0) {
      return false;
    }
    
    return true;
  },
  
  // Notification validation
  validateNotification(notification: Notification): boolean {
    if (!notification.id || !notification.title || !notification.message) {
      return false;
    }
    
    if (!notification.type || 
        !['workout', 'meal', 'water', 'reminder', 'achievement'].includes(notification.type)) {
      return false;
    }
    
    return true;
  },
  
  // Quick add entry validation
  validateQuickAddEntry(entry: QuickAddEntry): boolean {
    if (!entry.id || !entry.name) {
      return false;
    }
    
    if (entry.calories < 0 || entry.protein < 0 || entry.carbs < 0 || entry.fat < 0) {
      return false;
    }
    
    if (!entry.mealType || 
        !['breakfast', 'lunch', 'dinner', 'snack'].includes(entry.mealType)) {
      return false;
    }
    
    if (!entry.date) {
      return false;
    }
    
    return true;
  }
};

/**
 * Data migration utilities
 * These utilities help migrate data from localStorage to Supabase
 */
export const migrationUtils = {
  /**
   * Migrates user data from localStorage to Supabase
   * @param userId The user ID to migrate
   * @param localData The local data to migrate
   */
  async migrateLocalDataToSupabase(userId: string, localData: any): Promise<boolean> {
    try {
      const { 
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
      } = localData;
      
      // Save user profile
      await dataService.saveUser(user);
      
      // Save all data in parallel batches to avoid overwhelming the API
      // Custom foods first (as other entities depend on them)
      if (customFoods && customFoods.length > 0) {
        await Promise.all(customFoods.map(food => 
          dataService.saveCustomFood(userId, food)
        ));
      }
      
      // Food entries
      if (foodEntries && foodEntries.length > 0) {
        const batches = [];
        for (let i = 0; i < foodEntries.length; i += 10) {
          const batch = foodEntries.slice(i, i + 10);
          batches.push(Promise.all(batch.map(entry => 
            dataService.saveFoodEntry(userId, entry)
          )));
        }
        await Promise.all(batches);
      }
      
      // Planned food entries
      if (plannedFoodEntries && plannedFoodEntries.length > 0) {
        const batches = [];
        for (let i = 0; i < plannedFoodEntries.length; i += 10) {
          const batch = plannedFoodEntries.slice(i, i + 10);
          batches.push(Promise.all(batch.map(entry => 
            dataService.savePlannedFoodEntry(userId, entry)
          )));
        }
        await Promise.all(batches);
      }
      
      // Meal templates
      if (mealTemplates && mealTemplates.length > 0) {
        await Promise.all(mealTemplates.map(template => 
          dataService.saveMealTemplate(userId, template)
        ));
      }
      
      // Workouts
      if (workouts && workouts.length > 0) {
        await Promise.all(workouts.map(workout => 
          dataService.saveWorkout(userId, workout)
        ));
      }
      
      // Recipes
      if (recipes && recipes.length > 0) {
        await Promise.all(recipes.map(recipe => 
          dataService.saveRecipe(userId, recipe)
        ));
      }
      
      // Wellness entries
      if (wellnessEntries && wellnessEntries.length > 0) {
        await Promise.all(wellnessEntries.map(entry => 
          dataService.saveWellnessEntry(userId, entry)
        ));
      }
      
      // Notifications
      if (notifications && notifications.length > 0) {
        const batches = [];
        for (let i = 0; i < notifications.length; i += 10) {
          const batch = notifications.slice(i, i + 10);
          batches.push(Promise.all(batch.map(notification => 
            dataService.saveNotification(userId, notification)
          )));
        }
        await Promise.all(batches);
      }
      
      // Quick add entries
      if (quickAddEntries && quickAddEntries.length > 0) {
        await Promise.all(quickAddEntries.map(entry => 
          dataService.saveQuickAddEntry(userId, entry)
        ));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to migrate local data to Supabase:', error);
      return false;
    }
  }
};