import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, FoodEntry, Workout, Recipe, WellnessEntry } from '../types';

interface AppState {
  user: User | null;
  foodEntries: FoodEntry[];
  workouts: Workout[];
  recipes: Recipe[];
  wellnessEntries: WellnessEntry[];
  currentDate: string;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_FOOD_ENTRY'; payload: FoodEntry }
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
  currentDate: new Date().toISOString().split('T')[0]
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_FOOD_ENTRY':
      return { ...state, foodEntries: [...state.foodEntries, action.payload] };
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