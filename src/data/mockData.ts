import { Food, Exercise } from '../types';

export const mockFoods: Food[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    category: 'Protein'
  },
  {
    id: '2',
    name: 'Brown Rice',
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 0.9,
    category: 'Grains'
  },
  {
    id: '3',
    name: 'Broccoli',
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
    category: 'Vegetables'
  },
  {
    id: '4',
    name: 'Banana',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
    category: 'Fruits'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    category: 'Dairy'
  },
  {
    id: '6',
    name: 'Almonds',
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatPer100g: 50,
    category: 'Nuts'
  }
];

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    category: 'Bodyweight',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders']
  },
  {
    id: '2',
    name: 'Squats',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
  },
  {
    id: '3',
    name: 'Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Barbell'
  },
  {
    id: '4',
    name: 'Deadlift',
    category: 'Strength',
    muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell'
  },
  {
    id: '5',
    name: 'Running',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core']
  },
  {
    id: '6',
    name: 'Pull-ups',
    category: 'Bodyweight',
    muscleGroups: ['Back', 'Biceps']
  }
];

export const dietaryPreferences = [
  'None',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low Carb',
  'High Protein',
  'Gluten Free',
  'Dairy Free'
];

export const workoutStyles = [
  'Strength Training',
  'Cardio',
  'HIIT',
  'Yoga',
  'Pilates',
  'Bodyweight',
  'CrossFit',
  'Running',
  'Swimming',
  'Cycling',
  'Dance',
  'Martial Arts'
];