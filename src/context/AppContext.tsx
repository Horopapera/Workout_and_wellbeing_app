import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, FoodEntry, PlannedFoodEntry, MealTemplate, Workout, Recipe, WellnessEntry, Food, QuickAddEntry, Notification } from '../types';

interface AppState {
  user: User | null;
  foodEntries: FoodEntry[];
  plannedFoodEntries: PlannedFoodEntry[];
  mealTemplates: MealTemplate[];
  workouts: Workout[];
  recipes: Recipe[];
  wellnessEntries: WellnessEntry[];
  currentDate: string;
  customFoods: Food[];
  quickAddEntries: QuickAddEntry[];
  notifications: Notification[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER_MACRO_GOALS'; payload: { calories: number; protein: number; carbs: number; fat: number } }
  | { type: 'ADD_FOOD_ENTRY'; payload: FoodEntry }
  | { type: 'UPDATE_FOOD_ENTRY'; payload: FoodEntry }
  | { type: 'DELETE_FOOD_ENTRY'; payload: string }
  | { type: 'ADD_PLANNED_FOOD_ENTRY'; payload: PlannedFoodEntry }
  | { type: 'UPDATE_PLANNED_FOOD_ENTRY'; payload: PlannedFoodEntry }
  | { type: 'DELETE_PLANNED_FOOD_ENTRY'; payload: string }
  | { type: 'COPY_PLANNED_MEALS'; payload: { fromDate: string; toDate: string } }
  | { type: 'ADD_MEAL_TEMPLATE'; payload: MealTemplate }
  | { type: 'UPDATE_MEAL_TEMPLATE'; payload: MealTemplate }
  | { type: 'DELETE_MEAL_TEMPLATE'; payload: string }
  | { type: 'APPLY_MEAL_TEMPLATE'; payload: { templateId: string; date: string } }
  | { type: 'ADD_CUSTOM_FOOD'; payload: Food }
  | { type: 'UPDATE_CUSTOM_FOOD'; payload: Food }
  | { type: 'DELETE_CUSTOM_FOOD'; payload: string }
  | { type: 'UPDATE_FOOD_USAGE'; payload: string } // food ID
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: Recipe }
  | { type: 'DELETE_RECIPE'; payload: string }
  | { type: 'ADD_QUICK_ADD_ENTRY'; payload: QuickAddEntry }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'UPDATE_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_WELLNESS_ENTRY'; payload: WellnessEntry }
  | { type: 'SET_CURRENT_DATE'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'DELETE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  user: null,
  foodEntries: [],
  plannedFoodEntries: [],
  mealTemplates: [],
  workouts: [],
  recipes: [],
  wellnessEntries: [],
  currentDate: new Date().toISOString().split('T')[0],
  customFoods: [],
  quickAddEntries: [],
  notifications: [
    {
      id: '1',
      type: 'reminder',
      title: 'Welcome to your fitness journey!',
      message: 'Complete your first workout to get started',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: '2',
      type: 'meal',
      title: 'Meal reminder',
      message: "Don't forget to log your lunch",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ]
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_USER_MACRO_GOALS':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          customMacroGoals: action.payload
        } : null
      };
    case 'ADD_FOOD_ENTRY':
      return { ...state, foodEntries: [...state.foodEntries, action.payload] };
    case 'UPDATE_FOOD_ENTRY':
      return {
        ...state,
        foodEntries: state.foodEntries.map(entry => 
          entry.id === action.payload.id ? action.payload : entry
        )
      };
    case 'DELETE_FOOD_ENTRY':
      return {
        ...state,
        foodEntries: state.foodEntries.filter(entry => entry.id !== action.payload)
      };
    case 'ADD_PLANNED_FOOD_ENTRY':
      return { ...state, plannedFoodEntries: [...state.plannedFoodEntries, action.payload] };
    case 'UPDATE_PLANNED_FOOD_ENTRY':
      return {
        ...state,
        plannedFoodEntries: state.plannedFoodEntries.map(entry => 
          entry.id === action.payload.id ? action.payload : entry
        )
      };
    case 'DELETE_PLANNED_FOOD_ENTRY':
      return {
        ...state,
        plannedFoodEntries: state.plannedFoodEntries.filter(entry => entry.id !== action.payload)
      };
    case 'COPY_PLANNED_MEALS':
      const { fromDate, toDate } = action.payload;
      const mealsFromDate = state.plannedFoodEntries.filter(entry => entry.date === fromDate);
      const copiedMeals = mealsFromDate.map(entry => ({
        ...entry,
        id: `${entry.id}-copy-${Date.now()}-${Math.random()}`,
        date: toDate,
        createdAt: new Date().toISOString()
      }));
      return {
        ...state,
        plannedFoodEntries: [...state.plannedFoodEntries, ...copiedMeals]
      };
    case 'ADD_MEAL_TEMPLATE':
      return { ...state, mealTemplates: [...state.mealTemplates, action.payload] };
    case 'UPDATE_MEAL_TEMPLATE':
      return {
        ...state,
        mealTemplates: state.mealTemplates.map(template => 
          template.id === action.payload.id ? action.payload : template
        )
      };
    case 'DELETE_MEAL_TEMPLATE':
      return {
        ...state,
        mealTemplates: state.mealTemplates.filter(template => template.id !== action.payload)
      };
    case 'APPLY_MEAL_TEMPLATE':
      const { templateId, date } = action.payload;
      const template = state.mealTemplates.find(t => t.id === templateId);
      if (!template) return state;
      
      // Remove existing planned meals for this date
      const filteredPlanned = state.plannedFoodEntries.filter(entry => entry.date !== date);
      
      // Create new planned entries from template
      const newPlannedEntries: PlannedFoodEntry[] = [];
      Object.entries(template.meals).forEach(([mealType, entries]) => {
        entries.forEach(entry => {
          newPlannedEntries.push({
            ...entry,
            id: `template-${templateId}-${entry.id}-${Date.now()}-${Math.random()}`,
            date,
            createdAt: new Date().toISOString()
          });
        });
      });
      
      // Update template last used
      const updatedTemplates = state.mealTemplates.map(t => 
        t.id === templateId ? { ...t, lastUsed: new Date().toISOString() } : t
      );
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe => 
          recipe.id === action.payload.id ? action.payload : recipe
        )
      };
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
      };
    case 'ADD_QUICK_ADD_ENTRY':
      return { ...state, quickAddEntries: [...state.quickAddEntries, action.payload] };
      
      return {
        ...state,
        plannedFoodEntries: [...filteredPlanned, ...newPlannedEntries],
        mealTemplates: updatedTemplates
      };
    case 'ADD_CUSTOM_FOOD':
      return { ...state, customFoods: [...state.customFoods, action.payload] };
    case 'UPDATE_CUSTOM_FOOD':
      return {
        ...state,
        customFoods: state.customFoods.map(food => 
          food.id === action.payload.id ? action.payload : food
        )
      };
    case 'DELETE_CUSTOM_FOOD':
      return {
        ...state,
        customFoods: state.customFoods.filter(food => food.id !== action.payload)
      };
    case 'UPDATE_FOOD_USAGE':
      // Update usage count and last used date for both custom and built-in foods
      return {
        ...state,
        customFoods: state.customFoods.map(food => 
          food.id === action.payload ? {
            ...food,
            lastUsed: new Date().toISOString(),
            usageCount: (food.usageCount || 0) + 1
          } : food
        )
      };
    case 'ADD_WORKOUT':
      // Check if workout with same ID already exists (prevent duplicates)
      const existingWorkout = state.workouts.find(w => w.id === action.payload.id);
      if (existingWorkout) {
        return state;
      }
      return { ...state, workouts: [...state.workouts, action.payload] };
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map(w => 
          w.id === action.payload.id ? action.payload : w
        )
      };
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(w => w.id !== action.payload)
      };
    case 'ADD_WELLNESS_ENTRY':
      return { ...state, wellnessEntries: [...state.wellnessEntries, action.payload] };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        )
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true }))
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}