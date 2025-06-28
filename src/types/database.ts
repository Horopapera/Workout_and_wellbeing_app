// Database schema interfaces for Supabase migration
// These interfaces define the exact structure that will be used in Supabase tables

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  goal: 'lose' | 'gain' | 'maintain';
  target_weight?: number;
  current_weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietary_preferences: string[];
  workout_style: string[];
  daily_calories: number;
  macro_targets: {
    protein: number;
    carbs: number;
    fat: number;
  };
  custom_macro_goals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  preferences: {
    notifications: {
      workouts: boolean;
      meals: boolean;
      water: boolean;
      reminders: boolean;
    };
    units: 'metric' | 'imperial';
    theme: 'light' | 'dark';
  };
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface DatabaseFood {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  category: string;
  is_custom: boolean;
  created_by?: string; // user_id for custom foods
  usage_count: number;
  last_used?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseFoodEntry {
  id: string;
  user_id: string;
  food_id: string;
  amount: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD format
  created_at: string;
  updated_at: string;
}

export interface DatabasePlannedFoodEntry {
  id: string;
  user_id: string;
  food_id: string;
  amount: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD format
  created_at: string;
  updated_at: string;
}

export interface DatabaseMealTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  created_at: string;
  updated_at: string;
  last_used?: string;
}

export interface DatabaseMealTemplateItem {
  id: string;
  template_id: string;
  food_id: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  created_at: string;
}

export interface DatabaseWorkout {
  id: string;
  user_id: string;
  name: string;
  date?: string; // null for templates, YYYY-MM-DD for scheduled
  duration?: number; // in minutes
  start_time?: string;
  end_time?: string;
  calories_burned?: number;
  completed: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseWorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  notes?: string;
  created_at: string;
}

export interface DatabaseWorkoutSet {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  rest_time?: number; // in seconds
  completed: boolean;
  created_at: string;
}

export interface DatabaseExercise {
  id: string;
  name: string;
  category: string;
  muscle_groups: string[];
  equipment?: string;
  instructions?: string;
  is_custom: boolean;
  created_by?: string; // user_id for custom exercises
  created_at: string;
  updated_at: string;
}

export interface DatabaseRecipe {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  servings: number;
  instructions?: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  is_custom: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_used?: string;
}

export interface DatabaseRecipeIngredient {
  id: string;
  recipe_id: string;
  food_id: string;
  amount: number; // in grams
  order_index: number;
  created_at: string;
}

export interface DatabaseWellnessEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  water_intake: number; // in ml
  sleep_hours?: number;
  bedtime?: string;
  wake_time?: string;
  sleep_quality?: number; // 1-5 scale
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseNotification {
  id: string;
  user_id: string;
  type: 'workout' | 'meal' | 'water' | 'reminder' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseQuickAddEntry {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD format
  created_at: string;
}

// Migration mapping types
export type DatabaseTables = {
  users: DatabaseUser;
  foods: DatabaseFood;
  food_entries: DatabaseFoodEntry;
  planned_food_entries: DatabasePlannedFoodEntry;
  meal_templates: DatabaseMealTemplate;
  meal_template_items: DatabaseMealTemplateItem;
  workouts: DatabaseWorkout;
  workout_exercises: DatabaseWorkoutExercise;
  workout_sets: DatabaseWorkoutSet;
  exercises: DatabaseExercise;
  recipes: DatabaseRecipe;
  recipe_ingredients: DatabaseRecipeIngredient;
  wellness_entries: DatabaseWellnessEntry;
  notifications: DatabaseNotification;
  quick_add_entries: DatabaseQuickAddEntry;
};

// Row Level Security (RLS) policies that will be implemented in Supabase
export const RLS_POLICIES = {
  users: [
    'Users can only view and update their own profile',
    'Users cannot view other users data'
  ],
  food_entries: [
    'Users can only access their own food entries',
    'Users can CRUD their own food entries'
  ],
  planned_food_entries: [
    'Users can only access their own planned food entries',
    'Users can CRUD their own planned food entries'
  ],
  meal_templates: [
    'Users can only access their own meal templates',
    'Users can CRUD their own meal templates'
  ],
  workouts: [
    'Users can only access their own workouts',
    'Users can CRUD their own workouts'
  ],
  recipes: [
    'Users can only access their own recipes',
    'Users can CRUD their own recipes'
  ],
  wellness_entries: [
    'Users can only access their own wellness entries',
    'Users can CRUD their own wellness entries'
  ],
  notifications: [
    'Users can only access their own notifications',
    'Users can CRUD their own notifications'
  ],
  quick_add_entries: [
    'Users can only access their own quick add entries',
    'Users can CRUD their own quick add entries'
  ]
} as const;