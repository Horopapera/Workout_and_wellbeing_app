export interface User {
  id: string;
  name: string;
  email: string;
  goal: 'lose' | 'gain' | 'maintain';
  targetWeight?: number;
  currentWeight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietaryPreferences: string[];
  workoutStyle: string[];
  dailyCalories: number;
  macroTargets: {
    protein: number;
    carbs: number;
    fat: number;
  };
  onboardingCompleted: boolean;
  customMacroGoals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  category: string;
  isCustom?: boolean;
  createdBy?: string; // user ID for custom foods
  lastUsed?: string; // ISO date string
  usageCount?: number;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  food: Food;
  amount: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt?: string;
}

export interface PlannedFoodEntry {
  id: string;
  foodId: string;
  food: Food;
  amount: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt?: string;
}

export interface MealTemplate {
  id: string;
  name: string;
  description?: string;
  meals: {
    breakfast: PlannedFoodEntry[];
    lunch: PlannedFoodEntry[];
    dinner: PlannedFoodEntry[];
    snack: PlannedFoodEntry[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
  lastUsed?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: {
    foodId: string;
    food: Food;
    amount: number; // in grams
  }[];
  servings: number;
  instructions?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  createdAt: string;
  lastUsed?: string;
  isCustom?: boolean;
  createdBy?: string;
}

export interface QuickAddEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment?: string;
  instructions?: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  restTime?: number; // in seconds
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  date: string;
  duration?: number; // in minutes
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  caloriesBurned?: number;
  completed: boolean;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: {
    foodId: string;
    food: Food;
    amount: number;
  }[];
  servings: number;
  instructions?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
}

export interface WellnessEntry {
  id: string;
  date: string;
  waterIntake: number; // in ml
  sleepHours?: number;
  bedtime?: string;
  wakeTime?: string;
  sleepQuality?: number; // 1-5 scale
  notes?: string;
}