import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, FoodEntry, PlannedFoodEntry, MealTemplate, Workout, Recipe, WellnessEntry, Food, QuickAddEntry, Notification } from '../types';
import { saveUserProfile, loadUserProfile, saveAppData, loadAppData, clearAllUserData } from '../utils/localStorage';

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
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'LOGOUT_USER' }
  | { type: 'LOAD_USER_DATA'; payload: { user: User; appData: any } };

// Load user profile from localStorage on app start
const loadInitialState = (): AppState => {
  const savedUser = loadUserProfile();
  
  if (savedUser) {
    // Load user-specific app data
    const appData = loadAppData(savedUser.id);
    
    return {
      user: savedUser,
      foodEntries: appData?.foodEntries || [],
      plannedFoodEntries: appData?.plannedFoodEntries || [],
      mealTemplates: appData?.mealTemplates || [],
      workouts: appData?.workouts || [],
      recipes: appData?.recipes || [],
      wellnessEntries: appData?.wellnessEntries || [],
      currentDate: new Date().toISOString().split('T')[0],
      customFoods: appData?.customFoods || [],
      quickAddEntries: appData?.quickAddEntries || [],
      notifications: appData?.notifications || [
        {
          id: '1',
          type: 'reminder',
          title: 'Welcome back!',
          message: 'Continue your fitness journey today',
          timestamp: new Date().toISOString(),
          read: false
        }
      ]
    };
  }
  
  // Default state for new users
  return {
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
};

const initialState: AppState = loadInitialState();

// Save app data to localStorage whenever state changes
const saveAppDataToStorage = (state: AppState) => {
  if (state.user) {
    const appData = {
      foodEntries: state.foodEntries,
      plannedFoodEntries: state.plannedFoodEntries,
      mealTemplates: state.mealTemplates,
      workouts: state.workouts,
      recipes: state.recipes,
      wellnessEntries: state.wellnessEntries,
      customFoods: state.customFoods,
      quickAddEntries: state.quickAddEntries,
      notifications: state.notifications
    };
    saveAppData(state.user.id, appData);
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState;
  
  switch (action.type) {
    case 'SET_USER':
      newState = { ...state, user: action.payload };
      // Save user profile to localStorage
      saveUserProfile(action.payload);
      break;
      
    case 'LOAD_USER_DATA':
      newState = {
        ...state,
        user: action.payload.user,
        ...action.payload.appData
      };
      break;
      
    case 'LOGOUT_USER':
      // Clear all data from localStorage
      clearAllUserData();
      // Reset to initial empty state
      newState = {
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
        notifications: []
      };
      break;
      
    case 'UPDATE_USER_MACRO_GOALS':
      newState = {
        ...state,
        user: state.user ? {
          ...state.user,
          customMacroGoals: action.payload
        } : null
      };
      break;
      
    case 'ADD_FOOD_ENTRY':
      newState = { ...state, foodEntries: [...state.foodEntries, action.payload] };
      break;
      
    case 'UPDATE_FOOD_ENTRY':
      newState = {
        ...state,
        foodEntries: state.foodEntries.map(entry => 
          entry.id === action.payload.id ? action.payload : entry
        )
      };
      break;
      
    case 'DELETE_FOOD_ENTRY':
      newState = {
        ...state,
        foodEntries: state.foodEntries.filter(entry => entry.id !== action.payload)
      };
      break;
      
    case 'ADD_PLANNED_FOOD_ENTRY':
      newState = { ...state, plannedFoodEntries: [...state.plannedFoodEntries, action.payload] };
      break;
      
    case 'UPDATE_PLANNED_FOOD_ENTRY':
      newState = {
        ...state,
        plannedFoodEntries: state.plannedFoodEntries.map(entry => 
          entry.id === action.payload.id ? action.payload : entry
        )
      };
      break;
      
    case 'DELETE_PLANNED_FOOD_ENTRY':
      newState = {
        ...state,
        plannedFoodEntries: state.plannedFoodEntries.filter(entry => entry.id !== action.payload)
      };
      break;
      
    case 'COPY_PLANNED_MEALS':
      const { fromDate, toDate } = action.payload;
      const mealsFromDate = state.plannedFoodEntries.filter(entry => entry.date === fromDate);
      const copiedMeals = mealsFromDate.map(entry => ({
        ...entry,
        id: `${entry.id}-copy-${Date.now()}-${Math.random()}`,
        date: toDate,
        createdAt: new Date().toISOString()
      }));
      newState = {
        ...state,
        plannedFoodEntries: [...state.plannedFoodEntries, ...copiedMeals]
      };
      break;
      
    case 'ADD_MEAL_TEMPLATE':
      newState = { ...state, mealTemplates: [...state.mealTemplates, action.payload] };
      break;
      
    case 'UPDATE_MEAL_TEMPLATE':
      newState = {
        ...state,
        mealTemplates: state.mealTemplates.map(template => 
          template.id === action.payload.id ? action.payload : template
        )
      };
      break;
      
    case 'DELETE_MEAL_TEMPLATE':
      newState = {
        ...state,
        mealTemplates: state.mealTemplates.filter(template => template.id !== action.payload)
      };
      break;
      
    case 'APPLY_MEAL_TEMPLATE':
      const { templateId, date } = action.payload;
      const template = state.mealTemplates.find(t => t.id === templateId);
      if (!template) {
        newState = state;
        break;
      }
      
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
      
      newState = {
        ...state,
        plannedFoodEntries: [...filteredPlanned, ...newPlannedEntries],
        mealTemplates: updatedTemplates
      };
      break;
      
    case 'ADD_CUSTOM_FOOD':
      newState = { ...state, customFoods: [...state.customFoods, action.payload] };
      break;
      
    case 'UPDATE_CUSTOM_FOOD':
      newState = {
        ...state,
        customFoods: state.customFoods.map(food => 
          food.id === action.payload.id ? action.payload : food
        )
      };
      break;
      
    case 'DELETE_CUSTOM_FOOD':
      newState = {
        ...state,
        customFoods: state.customFoods.filter(food => food.id !== action.payload)
      };
      break;
      
    case 'UPDATE_FOOD_USAGE':
      newState = {
        ...state,
        customFoods: state.customFoods.map(food => 
          food.id === action.payload ? {
            ...food,
            lastUsed: new Date().toISOString()
          } : food
        )
      };
      break;
      
    case 'ADD_RECIPE':
      newState = { ...state, recipes: [...state.recipes, action.payload] };
      break;
      
    case 'UPDATE_RECIPE':
      newState = {
        ...state,
        recipes: state.recipes.map(recipe => 
          recipe.id === action.payload.id ? action.payload : recipe
        )
      };
      break;
      
    case 'DELETE_RECIPE':
      newState = {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
      };
      break;
      
    case 'ADD_QUICK_ADD_ENTRY':
      newState = { ...state, quickAddEntries: [...state.quickAddEntries, action.payload] };
      break;
      
    case 'ADD_WORKOUT':
      // Check if workout with same ID already exists (prevent duplicates)
      const existingWorkout = state.workouts.find(w => w.id === action.payload.id);
      if (existingWorkout) {
        newState = state;
        break;
      }
      newState = { ...state, workouts: [...state.workouts, action.payload] };
      break;
      
    case 'UPDATE_WORKOUT':
      newState = {
        ...state,
        workouts: state.workouts.map(w => 
          w.id === action.payload.id ? action.payload : w
        )
      };
      break;
      
    case 'DELETE_WORKOUT':
      newState = {
        ...state,
        workouts: state.workouts.filter(w => w.id !== action.payload)
      };
      break;
      
    case 'ADD_WELLNESS_ENTRY':
      newState = { ...state, wellnessEntries: [...state.wellnessEntries, action.payload] };
      break;
      
    case 'SET_CURRENT_DATE':
      newState = { ...state, currentDate: action.payload };
      break;
      
    case 'ADD_NOTIFICATION':
      newState = { ...state, notifications: [action.payload, ...state.notifications] };
      break;
      
    case 'MARK_NOTIFICATION_READ':
      newState = {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        )
      };
      break;
      
    case 'CLEAR_ALL_NOTIFICATIONS':
      newState = {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true }))
      };
      break;
      
    case 'DELETE_NOTIFICATION':
      newState = {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
      break;
      
    default:
      newState = state;
  }
  
  // Save app data to localStorage after state changes (except for logout)
  if (action.type !== 'LOGOUT_USER') {
    saveAppDataToStorage(newState);
  }
  
  return newState;
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