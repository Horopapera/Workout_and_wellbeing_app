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
import { DataStorage } from './dataService';
import { supabase } from './supabaseClient';
import { transformers, validators } from '../utils/dataUtils';

/**
 * Supabase implementation of DataStorage interface
 * 
 * This class implements the DataStorage interface using Supabase
 * for data persistence with proper user authentication and RLS.
 */
export class SupabaseAdapter implements DataStorage {
  // User operations
  async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return transformers.userFromDatabase(data);
    } catch (error) {
      console.error('Error fetching user from Supabase:', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      if (!validators.validateUser(user)) {
        throw new Error('Invalid user data');
      }

      const dbUser = transformers.userToDatabase(user);
      
      const { error } = await supabase
        .from('users')
        .upsert(dbUser, { onConflict: 'id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving user to Supabase:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Note: This will cascade delete all user data due to foreign key constraints
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user from Supabase:', error);
      throw error;
    }
  }

  // Food operations
  async getFoods(): Promise<Food[]> {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('is_custom', false);

      if (error) throw error;
      
      return data.map(transformers.foodFromDatabase);
    } catch (error) {
      console.error('Error fetching foods from Supabase:', error);
      return [];
    }
  }

  async getCustomFoods(userId: string): Promise<Food[]> {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('is_custom', true)
        .eq('created_by', userId);

      if (error) throw error;
      
      return data.map(transformers.foodFromDatabase);
    } catch (error) {
      console.error('Error fetching custom foods from Supabase:', error);
      return [];
    }
  }

  async saveCustomFood(userId: string, food: Food): Promise<void> {
    try {
      if (!validators.validateFood(food)) {
        throw new Error('Invalid food data');
      }

      const dbFood = transformers.foodToDatabase({
        ...food,
        isCustom: true,
        createdBy: userId
      });
      
      const { error } = await supabase
        .from('foods')
        .insert(dbFood);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving custom food to Supabase:', error);
      throw error;
    }
  }

  async updateCustomFood(userId: string, food: Food): Promise<void> {
    try {
      if (!validators.validateFood(food)) {
        throw new Error('Invalid food data');
      }

      const dbFood = transformers.foodToDatabase({
        ...food,
        isCustom: true,
        createdBy: userId
      });
      
      const { error } = await supabase
        .from('foods')
        .update(dbFood)
        .eq('id', food.id)
        .eq('created_by', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating custom food in Supabase:', error);
      throw error;
    }
  }

  async deleteCustomFood(userId: string, foodId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', foodId)
        .eq('created_by', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting custom food from Supabase:', error);
      throw error;
    }
  }

  // Food entry operations
  async getFoodEntries(userId: string): Promise<FoodEntry[]> {
    try {
      const { data, error } = await supabase
        .from('food_entries')
        .select(`
          *,
          foods:food_id (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      return data.map(entry => ({
        id: entry.id,
        foodId: entry.food_id,
        food: transformers.foodFromDatabase(entry.foods),
        amount: entry.amount,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        mealType: entry.meal_type,
        date: entry.date,
        createdAt: entry.created_at
      }));
    } catch (error) {
      console.error('Error fetching food entries from Supabase:', error);
      return [];
    }
  }

  async saveFoodEntry(userId: string, entry: FoodEntry): Promise<void> {
    try {
      if (!validators.validateFoodEntry(entry)) {
        throw new Error('Invalid food entry data');
      }

      const { error } = await supabase
        .from('food_entries')
        .insert({
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
          created_at: entry.createdAt || new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving food entry to Supabase:', error);
      throw error;
    }
  }

  async updateFoodEntry(userId: string, entry: FoodEntry): Promise<void> {
    try {
      if (!validators.validateFoodEntry(entry)) {
        throw new Error('Invalid food entry data');
      }

      const { error } = await supabase
        .from('food_entries')
        .update({
          food_id: entry.foodId,
          amount: entry.amount,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          meal_type: entry.mealType,
          date: entry.date,
          updated_at: new Date().toISOString()
        })
        .eq('id', entry.id)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating food entry in Supabase:', error);
      throw error;
    }
  }

  async deleteFoodEntry(userId: string, entryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting food entry from Supabase:', error);
      throw error;
    }
  }

  // Planned food entry operations
  async getPlannedFoodEntries(userId: string): Promise<PlannedFoodEntry[]> {
    try {
      const { data, error } = await supabase
        .from('planned_food_entries')
        .select(`
          *,
          foods:food_id (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      return data.map(entry => ({
        id: entry.id,
        foodId: entry.food_id,
        food: transformers.foodFromDatabase(entry.foods),
        amount: entry.amount,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        mealType: entry.meal_type,
        date: entry.date,
        createdAt: entry.created_at
      }));
    } catch (error) {
      console.error('Error fetching planned food entries from Supabase:', error);
      return [];
    }
  }

  async savePlannedFoodEntry(userId: string, entry: PlannedFoodEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('planned_food_entries')
        .insert({
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
          created_at: entry.createdAt || new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving planned food entry to Supabase:', error);
      throw error;
    }
  }

  async updatePlannedFoodEntry(userId: string, entry: PlannedFoodEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('planned_food_entries')
        .update({
          food_id: entry.foodId,
          amount: entry.amount,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          meal_type: entry.mealType,
          date: entry.date,
          updated_at: new Date().toISOString()
        })
        .eq('id', entry.id)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating planned food entry in Supabase:', error);
      throw error;
    }
  }

  async deletePlannedFoodEntry(userId: string, entryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('planned_food_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting planned food entry from Supabase:', error);
      throw error;
    }
  }

  // Meal template operations
  async getMealTemplates(userId: string): Promise<MealTemplate[]> {
    try {
      // First get all meal templates
      const { data: templates, error: templatesError } = await supabase
        .from('meal_templates')
        .select('*')
        .eq('user_id', userId);

      if (templatesError) throw templatesError;
      
      // Then get all template items
      const { data: items, error: itemsError } = await supabase
        .from('meal_template_items')
        .select(`
          *,
          foods:food_id (*)
        `)
        .in('template_id', templates.map(t => t.id));

      if (itemsError) throw itemsError;
      
      // Group items by template and meal type
      return templates.map(template => {
        const templateItems = items.filter(item => item.template_id === template.id);
        
        // Group by meal type
        const meals = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snack: []
        };
        
        templateItems.forEach(item => {
          const entry = {
            id: item.id,
            foodId: item.food_id,
            food: transformers.foodFromDatabase(item.foods),
            amount: item.amount,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            mealType: item.meal_type,
            date: '', // Not applicable for template items
            createdAt: item.created_at
          };
          
          meals[item.meal_type].push(entry);
        });
        
        return {
          id: template.id,
          name: template.name,
          description: template.description,
          meals,
          totalCalories: template.total_calories,
          totalProtein: template.total_protein,
          totalCarbs: template.total_carbs,
          totalFat: template.total_fat,
          createdAt: template.created_at,
          lastUsed: template.last_used
        };
      });
    } catch (error) {
      console.error('Error fetching meal templates from Supabase:', error);
      return [];
    }
  }

  async saveMealTemplate(userId: string, template: MealTemplate): Promise<void> {
    try {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;
      
      try {
        // Insert the template
        const { data: templateData, error: templateError } = await supabase
          .from('meal_templates')
          .insert({
            id: template.id,
            user_id: userId,
            name: template.name,
            description: template.description,
            total_calories: template.totalCalories,
            total_protein: template.totalProtein,
            total_carbs: template.totalCarbs,
            total_fat: template.totalFat,
            created_at: template.createdAt || new Date().toISOString(),
            last_used: template.lastUsed
          })
          .select()
          .single();

        if (templateError) throw templateError;
        
        // Insert all template items
        const templateItems = [];
        
        for (const [mealType, entries] of Object.entries(template.meals)) {
          for (const entry of entries) {
            templateItems.push({
              template_id: templateData.id,
              food_id: entry.foodId,
              amount: entry.amount,
              calories: entry.calories,
              protein: entry.protein,
              carbs: entry.carbs,
              fat: entry.fat,
              meal_type: mealType,
              created_at: entry.createdAt || new Date().toISOString()
            });
          }
        }
        
        if (templateItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('meal_template_items')
            .insert(templateItems);

          if (itemsError) throw itemsError;
        }
        
        // Commit the transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;
      } catch (error) {
        // Rollback the transaction on error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error saving meal template to Supabase:', error);
      throw error;
    }
  }

  async updateMealTemplate(userId: string, template: MealTemplate): Promise<void> {
    try {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;
      
      try {
        // Update the template
        const { error: templateError } = await supabase
          .from('meal_templates')
          .update({
            name: template.name,
            description: template.description,
            total_calories: template.totalCalories,
            total_protein: template.totalProtein,
            total_carbs: template.totalCarbs,
            total_fat: template.totalFat,
            updated_at: new Date().toISOString(),
            last_used: template.lastUsed
          })
          .eq('id', template.id)
          .eq('user_id', userId);

        if (templateError) throw templateError;
        
        // Delete all existing template items
        const { error: deleteError } = await supabase
          .from('meal_template_items')
          .delete()
          .eq('template_id', template.id);

        if (deleteError) throw deleteError;
        
        // Insert all template items
        const templateItems = [];
        
        for (const [mealType, entries] of Object.entries(template.meals)) {
          for (const entry of entries) {
            templateItems.push({
              template_id: template.id,
              food_id: entry.foodId,
              amount: entry.amount,
              calories: entry.calories,
              protein: entry.protein,
              carbs: entry.carbs,
              fat: entry.fat,
              meal_type: mealType,
              created_at: entry.createdAt || new Date().toISOString()
            });
          }
        }
        
        if (templateItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('meal_template_items')
            .insert(templateItems);

          if (itemsError) throw itemsError;
        }
        
        // Commit the transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;
      } catch (error) {
        // Rollback the transaction on error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error updating meal template in Supabase:', error);
      throw error;
    }
  }

  async deleteMealTemplate(userId: string, templateId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('meal_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting meal template from Supabase:', error);
      throw error;
    }
  }

  // Workout operations
  async getWorkouts(userId: string): Promise<Workout[]> {
    try {
      // First get all workouts
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId);

      if (workoutsError) throw workoutsError;
      
      // For each workout, get its exercises
      const result: Workout[] = [];
      
      for (const workout of workouts) {
        // Get workout exercises
        const { data: workoutExercises, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select(`
            *,
            exercises:exercise_id (*)
          `)
          .eq('workout_id', workout.id)
          .order('order_index', { ascending: true });

        if (exercisesError) throw exercisesError;
        
        // For each exercise, get its sets
        const exercises = [];
        
        for (const workoutExercise of workoutExercises) {
          const { data: sets, error: setsError } = await supabase
            .from('workout_sets')
            .select('*')
            .eq('workout_exercise_id', workoutExercise.id)
            .order('set_number', { ascending: true });

          if (setsError) throw setsError;
          
          exercises.push({
            id: workoutExercise.id,
            exerciseId: workoutExercise.exercise_id,
            exercise: {
              id: workoutExercise.exercises.id,
              name: workoutExercise.exercises.name,
              category: workoutExercise.exercises.category,
              muscleGroups: workoutExercise.exercises.muscle_groups,
              equipment: workoutExercise.exercises.equipment,
              instructions: workoutExercise.exercises.instructions
            },
            sets: sets.map(set => ({
              id: set.id,
              reps: set.reps,
              weight: set.weight,
              duration: set.duration,
              restTime: set.rest_time,
              completed: set.completed
            })),
            notes: workoutExercise.notes
          });
        }
        
        result.push({
          id: workout.id,
          name: workout.name,
          exercises,
          date: workout.date,
          duration: workout.duration,
          startTime: workout.start_time,
          endTime: workout.end_time,
          caloriesBurned: workout.calories_burned,
          completed: workout.completed,
          notes: workout.notes
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching workouts from Supabase:', error);
      return [];
    }
  }

  async saveWorkout(userId: string, workout: Workout): Promise<void> {
    try {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;
      
      try {
        // Insert the workout
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .insert({
            id: workout.id,
            user_id: userId,
            name: workout.name,
            date: workout.date,
            duration: workout.duration,
            start_time: workout.startTime,
            end_time: workout.endTime,
            calories_burned: workout.caloriesBurned,
            completed: workout.completed,
            notes: workout.notes
          })
          .select()
          .single();

        if (workoutError) throw workoutError;
        
        // Insert all exercises and their sets
        for (let i = 0; i < workout.exercises.length; i++) {
          const exercise = workout.exercises[i];
          
          // Insert the exercise
          const { data: exerciseData, error: exerciseError } = await supabase
            .from('workout_exercises')
            .insert({
              id: exercise.id,
              workout_id: workoutData.id,
              exercise_id: exercise.exerciseId,
              order_index: i,
              notes: exercise.notes
            })
            .select()
            .single();

          if (exerciseError) throw exerciseError;
          
          // Insert all sets
          const sets = exercise.sets.map((set, j) => ({
            id: set.id,
            workout_exercise_id: exerciseData.id,
            set_number: j + 1,
            reps: set.reps,
            weight: set.weight,
            duration: set.duration,
            rest_time: set.restTime,
            completed: set.completed
          }));
          
          if (sets.length > 0) {
            const { error: setsError } = await supabase
              .from('workout_sets')
              .insert(sets);

            if (setsError) throw setsError;
          }
        }
        
        // Commit the transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;
      } catch (error) {
        // Rollback the transaction on error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error saving workout to Supabase:', error);
      throw error;
    }
  }

  async updateWorkout(userId: string, workout: Workout): Promise<void> {
    try {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;
      
      try {
        // Update the workout
        const { error: workoutError } = await supabase
          .from('workouts')
          .update({
            name: workout.name,
            date: workout.date,
            duration: workout.duration,
            start_time: workout.startTime,
            end_time: workout.endTime,
            calories_burned: workout.caloriesBurned,
            completed: workout.completed,
            notes: workout.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', workout.id)
          .eq('user_id', userId);

        if (workoutError) throw workoutError;
        
        // Get existing workout exercises
        const { data: existingExercises, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select('id')
          .eq('workout_id', workout.id);

        if (exercisesError) throw exercisesError;
        
        // Delete all existing exercises and their sets (cascade delete will handle sets)
        if (existingExercises.length > 0) {
          const { error: deleteError } = await supabase
            .from('workout_exercises')
            .delete()
            .eq('workout_id', workout.id);

          if (deleteError) throw deleteError;
        }
        
        // Insert all exercises and their sets
        for (let i = 0; i < workout.exercises.length; i++) {
          const exercise = workout.exercises[i];
          
          // Insert the exercise
          const { data: exerciseData, error: exerciseError } = await supabase
            .from('workout_exercises')
            .insert({
              id: exercise.id,
              workout_id: workout.id,
              exercise_id: exercise.exerciseId,
              order_index: i,
              notes: exercise.notes
            })
            .select()
            .single();

          if (exerciseError) throw exerciseError;
          
          // Insert all sets
          const sets = exercise.sets.map((set, j) => ({
            id: set.id,
            workout_exercise_id: exerciseData.id,
            set_number: j + 1,
            reps: set.reps,
            weight: set.weight,
            duration: set.duration,
            rest_time: set.restTime,
            completed: set.completed
          }));
          
          if (sets.length > 0) {
            const { error: setsError } = await supabase
              .from('workout_sets')
              .insert(sets);

            if (setsError) throw setsError;
          }
        }
        
        // Commit the transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;
      } catch (error) {
        // Rollback the transaction on error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error updating workout in Supabase:', error);
      throw error;
    }
  }

  async deleteWorkout(userId: string, workoutId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting workout from Supabase:', error);
      throw error;
    }
  }

  // Recipe operations
  async getRecipes(userId: string): Promise<Recipe[]> {
    try {
      // First get all recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId);

      if (recipesError) throw recipesError;
      
      // For each recipe, get its ingredients
      const result: Recipe[] = [];
      
      for (const recipe of recipes) {
        // Get recipe ingredients
        const { data: recipeIngredients, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select(`
            *,
            foods:food_id (*)
          `)
          .eq('recipe_id', recipe.id)
          .order('order_index', { ascending: true });

        if (ingredientsError) throw ingredientsError;
        
        result.push({
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          ingredients: recipeIngredients.map(ingredient => ({
            foodId: ingredient.food_id,
            food: transformers.foodFromDatabase(ingredient.foods),
            amount: ingredient.amount
          })),
          servings: recipe.servings,
          instructions: recipe.instructions,
          totalCalories: recipe.total_calories,
          totalProtein: recipe.total_protein,
          totalCarbs: recipe.total_carbs,
          totalFat: recipe.total_fat,
          caloriesPerServing: recipe.calories_per_serving,
          proteinPerServing: recipe.protein_per_serving,
          carbsPerServing: recipe.carbs_per_serving,
          fatPerServing: recipe.fat_per_serving,
          createdAt: recipe.created_at,
          lastUsed: recipe.last_used,
          isCustom: recipe.is_custom,
          createdBy: recipe.created_by
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching recipes from Supabase:', error);
      return [];
    }
  }

  async saveRecipe(userId: string, recipe: Recipe): Promise<void> {
    try {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;
      
      try {
        // Insert the recipe
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .insert({
            id: recipe.id,
            user_id: userId,
            name: recipe.name,
            description: recipe.description,
            servings: recipe.servings,
            instructions: recipe.instructions,
            total_calories: recipe.totalCalories,
            total_protein: recipe.totalProtein,
            total_carbs: recipe.totalCarbs,
            total_fat: recipe.totalFat,
            calories_per_serving: recipe.caloriesPerServing,
            protein_per_serving: recipe.proteinPerServing,
            carbs_per_serving: recipe.carbsPerServing,
            fat_per_serving: recipe.fatPerServing,
            is_custom: recipe.isCustom || true,
            created_by: userId,
            created_at: recipe.createdAt || new Date().toISOString(),
            last_used: recipe.lastUsed
          })
          .select()
          .single();

        if (recipeError) throw recipeError;
        
        // Insert all ingredients
        const ingredients = recipe.ingredients.map((ingredient, i) => ({
          recipe_id: recipeData.id,
          food_id: ingredient.foodId,
          amount: ingredient.amount,
          order_index: i
        }));
        
        if (ingredients.length > 0) {
          const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredients);

          if (ingredientsError) throw ingredientsError;
        }
        
        // Commit the transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;
      } catch (error) {
        // Rollback the transaction on error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error saving recipe to Supabase:', error);
      throw error;
    }
  }

  async updateRecipe(userId: string, recipe: Recipe): Promise<void> {
    try {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;
      
      try {
        // Update the recipe
        const { error: recipeError } = await supabase
          .from('recipes')
          .update({
            name: recipe.name,
            description: recipe.description,
            servings: recipe.servings,
            instructions: recipe.instructions,
            total_calories: recipe.totalCalories,
            total_protein: recipe.totalProtein,
            total_carbs: recipe.totalCarbs,
            total_fat: recipe.totalFat,
            calories_per_serving: recipe.caloriesPerServing,
            protein_per_serving: recipe.proteinPerServing,
            carbs_per_serving: recipe.carbsPerServing,
            fat_per_serving: recipe.fatPerServing,
            updated_at: new Date().toISOString(),
            last_used: recipe.lastUsed
          })
          .eq('id', recipe.id)
          .eq('user_id', userId);

        if (recipeError) throw recipeError;
        
        // Delete all existing ingredients
        const { error: deleteError } = await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', recipe.id);

        if (deleteError) throw deleteError;
        
        // Insert all ingredients
        const ingredients = recipe.ingredients.map((ingredient, i) => ({
          recipe_id: recipe.id,
          food_id: ingredient.foodId,
          amount: ingredient.amount,
          order_index: i
        }));
        
        if (ingredients.length > 0) {
          const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredients);

          if (ingredientsError) throw ingredientsError;
        }
        
        // Commit the transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw commitError;
      } catch (error) {
        // Rollback the transaction on error
        await supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error updating recipe in Supabase:', error);
      throw error;
    }
  }

  async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting recipe from Supabase:', error);
      throw error;
    }
  }

  // Wellness operations
  async getWellnessEntries(userId: string): Promise<WellnessEntry[]> {
    try {
      const { data, error } = await supabase
        .from('wellness_entries')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      return data.map(entry => ({
        id: entry.id,
        date: entry.date,
        waterIntake: entry.water_intake,
        sleepHours: entry.sleep_hours,
        bedtime: entry.bedtime,
        wakeTime: entry.wake_time,
        sleepQuality: entry.sleep_quality,
        notes: entry.notes
      }));
    } catch (error) {
      console.error('Error fetching wellness entries from Supabase:', error);
      return [];
    }
  }

  async saveWellnessEntry(userId: string, entry: WellnessEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('wellness_entries')
        .insert({
          id: entry.id,
          user_id: userId,
          date: entry.date,
          water_intake: entry.waterIntake,
          sleep_hours: entry.sleepHours,
          bedtime: entry.bedtime,
          wake_time: entry.wakeTime,
          sleep_quality: entry.sleepQuality,
          notes: entry.notes
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving wellness entry to Supabase:', error);
      throw error;
    }
  }

  async updateWellnessEntry(userId: string, entry: WellnessEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('wellness_entries')
        .update({
          water_intake: entry.waterIntake,
          sleep_hours: entry.sleepHours,
          bedtime: entry.bedtime,
          wake_time: entry.wakeTime,
          sleep_quality: entry.sleepQuality,
          notes: entry.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', entry.id)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating wellness entry in Supabase:', error);
      throw error;
    }
  }

  async deleteWellnessEntry(userId: string, entryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('wellness_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting wellness entry from Supabase:', error);
      throw error;
    }
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        actionUrl: notification.action_url,
        timestamp: notification.created_at
      }));
    } catch (error) {
      console.error('Error fetching notifications from Supabase:', error);
      return [];
    }
  }

  async saveNotification(userId: string, notification: Notification): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          id: notification.id,
          user_id: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          read: notification.read,
          action_url: notification.actionUrl,
          created_at: notification.timestamp || new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving notification to Supabase:', error);
      throw error;
    }
  }

  async updateNotification(userId: string, notification: Notification): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: notification.read,
          updated_at: new Date().toISOString()
        })
        .eq('id', notification.id)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating notification in Supabase:', error);
      throw error;
    }
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification from Supabase:', error);
      throw error;
    }
  }

  // Quick add operations
  async getQuickAddEntries(userId: string): Promise<QuickAddEntry[]> {
    try {
      const { data, error } = await supabase
        .from('quick_add_entries')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      return data.map(entry => ({
        id: entry.id,
        name: entry.name,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        mealType: entry.meal_type,
        date: entry.date,
        createdAt: entry.created_at
      }));
    } catch (error) {
      console.error('Error fetching quick add entries from Supabase:', error);
      return [];
    }
  }

  async saveQuickAddEntry(userId: string, entry: QuickAddEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('quick_add_entries')
        .insert({
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
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving quick add entry to Supabase:', error);
      throw error;
    }
  }
}