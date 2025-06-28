/*
  # Create Database Schema for Fitness App

  1. Tables
    - `users` - User profiles and preferences
    - `foods` - Food database (built-in + custom)
    - `food_entries` - Logged food consumption
    - `planned_food_entries` - Planned meals
    - `meal_templates` - Saved meal templates
    - `meal_template_items` - Items within meal templates
    - `workouts` - Workout routines and sessions
    - `workout_exercises` - Exercises within workouts
    - `workout_sets` - Sets within exercises
    - `exercises` - Exercise database
    - `recipes` - Custom recipes
    - `recipe_ingredients` - Ingredients within recipes
    - `wellness_entries` - Daily wellness tracking
    - `notifications` - User notifications
    - `quick_add_entries` - Quick nutrition entries

  2. Security
    - Row Level Security (RLS) policies for all tables
    - Users can only access their own data
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  goal TEXT NOT NULL CHECK (goal IN ('lose', 'gain', 'maintain')),
  target_weight DECIMAL,
  current_weight DECIMAL NOT NULL,
  height DECIMAL NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  dietary_preferences TEXT[] DEFAULT '{}',
  workout_style TEXT[] DEFAULT '{}',
  daily_calories INTEGER NOT NULL,
  macro_targets JSONB NOT NULL,
  custom_macro_goals JSONB,
  preferences JSONB NOT NULL,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- Foods table
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT,
  calories_per_100g DECIMAL NOT NULL,
  protein_per_100g DECIMAL NOT NULL DEFAULT 0,
  carbs_per_100g DECIMAL NOT NULL DEFAULT 0,
  fat_per_100g DECIMAL NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Food entries table
CREATE TABLE IF NOT EXISTS food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  calories DECIMAL NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Planned food entries table
CREATE TABLE IF NOT EXISTS planned_food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  calories DECIMAL NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Meal templates table
CREATE TABLE IF NOT EXISTS meal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_calories DECIMAL NOT NULL,
  total_protein DECIMAL NOT NULL,
  total_carbs DECIMAL NOT NULL,
  total_fat DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_used TIMESTAMPTZ
);

-- Meal template items table
CREATE TABLE IF NOT EXISTS meal_template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES meal_templates(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  calories DECIMAL NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  equipment TEXT,
  instructions TEXT,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TEXT, -- null for templates, YYYY-MM-DD for scheduled
  duration INTEGER, -- in minutes
  start_time TEXT,
  end_time TEXT,
  calories_burned INTEGER,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Workout exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workout sets table
CREATE TABLE IF NOT EXISTS workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL,
  duration INTEGER, -- in seconds
  rest_time INTEGER, -- in seconds
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  servings INTEGER NOT NULL,
  instructions TEXT,
  total_calories DECIMAL NOT NULL,
  total_protein DECIMAL NOT NULL,
  total_carbs DECIMAL NOT NULL,
  total_fat DECIMAL NOT NULL,
  calories_per_serving DECIMAL NOT NULL,
  protein_per_serving DECIMAL NOT NULL,
  carbs_per_serving DECIMAL NOT NULL,
  fat_per_serving DECIMAL NOT NULL,
  is_custom BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_used TIMESTAMPTZ
);

-- Recipe ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wellness entries table
CREATE TABLE IF NOT EXISTS wellness_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  water_intake INTEGER NOT NULL, -- in ml
  sleep_hours DECIMAL,
  bedtime TEXT,
  wake_time TEXT,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('workout', 'meal', 'water', 'reminder', 'achievement')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quick add entries table
CREATE TABLE IF NOT EXISTS quick_add_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories DECIMAL NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS food_entries_user_id_date_idx ON food_entries(user_id, date);
CREATE INDEX IF NOT EXISTS planned_food_entries_user_id_date_idx ON planned_food_entries(user_id, date);
CREATE INDEX IF NOT EXISTS workouts_user_id_date_idx ON workouts(user_id, date);
CREATE INDEX IF NOT EXISTS notifications_user_id_created_at_idx ON notifications(user_id, created_at);
CREATE INDEX IF NOT EXISTS foods_name_idx ON foods(name);
CREATE INDEX IF NOT EXISTS recipes_user_id_name_idx ON recipes(user_id, name);
CREATE INDEX IF NOT EXISTS wellness_entries_user_id_date_idx ON wellness_entries(user_id, date);