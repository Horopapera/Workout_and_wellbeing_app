/*
  # Row Level Security Policies
  
  This migration creates RLS policies for all tables to ensure data security.
  Each policy ensures users can only access their own data.
*/

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_add_entries ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Foods table policies
CREATE POLICY "Anyone can view public foods" 
  ON foods FOR SELECT 
  USING (NOT is_custom OR created_by = auth.uid());

CREATE POLICY "Users can insert custom foods" 
  ON foods FOR INSERT 
  WITH CHECK (is_custom AND created_by = auth.uid());

CREATE POLICY "Users can update own custom foods" 
  ON foods FOR UPDATE 
  USING (is_custom AND created_by = auth.uid());

CREATE POLICY "Users can delete own custom foods" 
  ON foods FOR DELETE 
  USING (is_custom AND created_by = auth.uid());

-- Food entries policies
CREATE POLICY "Users can view own food entries" 
  ON food_entries FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own food entries" 
  ON food_entries FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own food entries" 
  ON food_entries FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own food entries" 
  ON food_entries FOR DELETE 
  USING (user_id = auth.uid());

-- Planned food entries policies
CREATE POLICY "Users can view own planned food entries" 
  ON planned_food_entries FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own planned food entries" 
  ON planned_food_entries FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own planned food entries" 
  ON planned_food_entries FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own planned food entries" 
  ON planned_food_entries FOR DELETE 
  USING (user_id = auth.uid());

-- Meal templates policies
CREATE POLICY "Users can view own meal templates" 
  ON meal_templates FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own meal templates" 
  ON meal_templates FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own meal templates" 
  ON meal_templates FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own meal templates" 
  ON meal_templates FOR DELETE 
  USING (user_id = auth.uid());

-- Meal template items policies
CREATE POLICY "Users can view own meal template items" 
  ON meal_template_items FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM meal_templates 
    WHERE meal_templates.id = meal_template_items.template_id 
    AND meal_templates.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own meal template items" 
  ON meal_template_items FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_templates 
    WHERE meal_templates.id = meal_template_items.template_id 
    AND meal_templates.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own meal template items" 
  ON meal_template_items FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM meal_templates 
    WHERE meal_templates.id = meal_template_items.template_id 
    AND meal_templates.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own meal template items" 
  ON meal_template_items FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM meal_templates 
    WHERE meal_templates.id = meal_template_items.template_id 
    AND meal_templates.user_id = auth.uid()
  ));

-- Exercises policies
CREATE POLICY "Anyone can view public exercises" 
  ON exercises FOR SELECT 
  USING (NOT is_custom OR created_by = auth.uid());

CREATE POLICY "Users can insert custom exercises" 
  ON exercises FOR INSERT 
  WITH CHECK (is_custom AND created_by = auth.uid());

CREATE POLICY "Users can update own custom exercises" 
  ON exercises FOR UPDATE 
  USING (is_custom AND created_by = auth.uid());

CREATE POLICY "Users can delete own custom exercises" 
  ON exercises FOR DELETE 
  USING (is_custom AND created_by = auth.uid());

-- Workouts policies
CREATE POLICY "Users can view own workouts" 
  ON workouts FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workouts" 
  ON workouts FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workouts" 
  ON workouts FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own workouts" 
  ON workouts FOR DELETE 
  USING (user_id = auth.uid());

-- Workout exercises policies
CREATE POLICY "Users can view own workout exercises" 
  ON workout_exercises FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own workout exercises" 
  ON workout_exercises FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own workout exercises" 
  ON workout_exercises FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own workout exercises" 
  ON workout_exercises FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  ));

-- Workout sets policies
CREATE POLICY "Users can view own workout sets" 
  ON workout_sets FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM workout_exercises
    JOIN workouts ON workouts.id = workout_exercises.workout_id
    WHERE workout_exercises.id = workout_sets.workout_exercise_id 
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own workout sets" 
  ON workout_sets FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM workout_exercises
    JOIN workouts ON workouts.id = workout_exercises.workout_id
    WHERE workout_exercises.id = workout_sets.workout_exercise_id 
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own workout sets" 
  ON workout_sets FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM workout_exercises
    JOIN workouts ON workouts.id = workout_exercises.workout_id
    WHERE workout_exercises.id = workout_sets.workout_exercise_id 
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own workout sets" 
  ON workout_sets FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM workout_exercises
    JOIN workouts ON workouts.id = workout_exercises.workout_id
    WHERE workout_exercises.id = workout_sets.workout_exercise_id 
    AND workouts.user_id = auth.uid()
  ));

-- Recipes policies
CREATE POLICY "Users can view own recipes" 
  ON recipes FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own recipes" 
  ON recipes FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND created_by = auth.uid());

CREATE POLICY "Users can update own recipes" 
  ON recipes FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own recipes" 
  ON recipes FOR DELETE 
  USING (user_id = auth.uid());

-- Recipe ingredients policies
CREATE POLICY "Users can view own recipe ingredients" 
  ON recipe_ingredients FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM recipes 
    WHERE recipes.id = recipe_ingredients.recipe_id 
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own recipe ingredients" 
  ON recipe_ingredients FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes 
    WHERE recipes.id = recipe_ingredients.recipe_id 
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own recipe ingredients" 
  ON recipe_ingredients FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM recipes 
    WHERE recipes.id = recipe_ingredients.recipe_id 
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own recipe ingredients" 
  ON recipe_ingredients FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM recipes 
    WHERE recipes.id = recipe_ingredients.recipe_id 
    AND recipes.user_id = auth.uid()
  ));

-- Wellness entries policies
CREATE POLICY "Users can view own wellness entries" 
  ON wellness_entries FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own wellness entries" 
  ON wellness_entries FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own wellness entries" 
  ON wellness_entries FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own wellness entries" 
  ON wellness_entries FOR DELETE 
  USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications" 
  ON notifications FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notifications" 
  ON notifications FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications" 
  ON notifications FOR DELETE 
  USING (user_id = auth.uid());

-- Quick add entries policies
CREATE POLICY "Users can view own quick add entries" 
  ON quick_add_entries FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own quick add entries" 
  ON quick_add_entries FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own quick add entries" 
  ON quick_add_entries FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own quick add entries" 
  ON quick_add_entries FOR DELETE 
  USING (user_id = auth.uid());