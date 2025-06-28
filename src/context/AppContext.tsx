import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, FoodEntry, Workout, Recipe, WellnessEntry } from '../types';

interface AppState {
  user: User | null;
  foodEntries: FoodEntry[];
  workouts: Workout[];
  recipes: Recipe[];
  wellnessEntries: WellnessEntry[];
  currentDate: string;
  customFoods: Food[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER_MACRO_GOALS'; payload: { calories: number; protein: number; carbs: number; fat: number } }
  | { type: 'ADD_FOOD_ENTRY'; payload: FoodEntry }
  | { type: 'UPDATE_FOOD_ENTRY'; payload: FoodEntry }
  | { type: 'DELETE_FOOD_ENTRY'; payload: string }
  | { type: 'ADD_CUSTOM_FOOD'; payload: Food }
  | { type: 'UPDATE_CUSTOM_FOOD'; payload: Food }
  | { type: 'DELETE_CUSTOM_FOOD'; payload: string }
  | { type: 'UPDATE_FOOD_USAGE'; payload: string } // food ID
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'UPDATE_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'ADD_WELLNESS_ENTRY'; payload: WellnessEntry }
  | { type: 'SET_CURRENT_DATE'; payload: string };

const initialState: AppState = {
  user: null,
  foodEntries: [],
  workouts: [],
  recipes: [],
  wellnessEntries: [],
  currentDate: new Date().toISOString().split('T')[0],
  customFoods: []
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
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };
    case 'ADD_WELLNESS_ENTRY':
      return { ...state, wellnessEntries: [...state.wellnessEntries, action.payload] };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
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