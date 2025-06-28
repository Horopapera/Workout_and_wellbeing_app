// Data utilities for transforming between app and database models
// These will be used in Phase 5 when migrating to Supabase

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
import { 
  DatabaseUser, 
  DatabaseFood, 
  DatabaseFoodEntry, 
  DatabasePlannedFoodEntry, 
  DatabaseMealTemplate, 
  DatabaseMealTemplateItem, 
  DatabaseWorkout, 
  DatabaseWorkoutExercise, 
  DatabaseWorkoutSet, 
  DatabaseExercise, 
  DatabaseRecipe, 
  DatabaseRecipeIngredient, 
  DatabaseWellnessEntry, 
  DatabaseNotification, 
  DatabaseQuickAddEntry 
} from '../types/database';

/**
 * Transform app model to database model
 * These functions will be used in Phase 5 when migrating to Supabase
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

  // More transformers will be added for all data types
  // This is a placeholder for Phase 5 implementation
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

  // More validators will be added for all data types
  // This is a placeholder for Phase 5 implementation
};

/**
 * Data migration utilities
 * These will be used in Phase 5 to migrate data from localStorage to Supabase
 */
export const migrationUtils = {
  // Generate SQL for creating tables
  generateCreateTableSQL(): string[] {
    // This will be implemented in Phase 5
    return [];
  },

  // Generate SQL for creating RLS policies
  generateRLSPoliciesSQL(): string[] {
    // This will be implemented in Phase 5
    return [];
  },

  // Generate SQL for creating indexes
  generateIndexesSQL(): string[] {
    // This will be implemented in Phase 5
    return [];
  }
};