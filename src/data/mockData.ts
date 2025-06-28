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
  // Chest Exercises
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
    id: '11',
    name: 'Bent-over Row',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Barbell'
  },
  {
    id: '12',
    name: 'Lat Pulldown',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Cable Machine'
  },
  {
    id: '13',
    name: 'T-Bar Row',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'T-Bar'
  },
  {
    id: '14',
    name: 'Seated Cable Row',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Cable Machine'
  },
  {
    id: '15',
    name: 'Face Pulls',
    category: 'Strength',
    muscleGroups: ['Back', 'Shoulders'],
    equipment: 'Cable Machine'
  },

  // Leg Exercises
  {
    id: '2',
    name: 'Squats',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
  },
  {
    id: '16',
    name: 'Back Squat',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell'
  },
  {
    id: '17',
    name: 'Front Squat',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Core'],
    equipment: 'Barbell'
  },
  {
    id: '18',
    name: 'Bulgarian Split Squats',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes']
  },
  {
    id: '19',
    name: 'Lunges',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
  },
  {
    id: '20',
    name: 'Romanian Deadlift',
    category: 'Strength',
    muscleGroups: ['Hamstrings', 'Glutes'],
    equipment: 'Barbell'
  },
  {
    id: '21',
    name: 'Leg Press',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes'],
    equipment: 'Machine'
  },
  {
    id: '22',
    name: 'Leg Curls',
    category: 'Strength',
    muscleGroups: ['Hamstrings'],
    equipment: 'Machine'
  },
  {
    id: '23',
    name: 'Leg Extensions',
    category: 'Strength',
    muscleGroups: ['Quadriceps'],
    equipment: 'Machine'
  },
  {
    id: '24',
    name: 'Calf Raises',
    category: 'Strength',
    muscleGroups: ['Calves'],
    equipment: 'Dumbbells'
  },
  {
    id: '25',
    name: 'Hip Thrusts',
    category: 'Strength',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: 'Barbell'
  },

  // Shoulder Exercises
  {
    id: '26',
    name: 'Overhead Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Barbell'
  },
  {
    id: '27',
    name: 'Dumbbell Shoulder Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells'
  },
  {
    id: '28',
    name: 'Lateral Raises',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    equipment: 'Dumbbells'
  },
  {
    id: '29',
    name: 'Front Raises',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    equipment: 'Dumbbells'
  },
  {
    id: '30',
    name: 'Rear Delt Flyes',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    equipment: 'Dumbbells'
  },
  {
    id: '31',
    name: 'Arnold Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells'
  },
  {
    id: '32',
    name: 'Pike Push-ups',
    category: 'Bodyweight',
    muscleGroups: ['Shoulders', 'Triceps']
  },

  // Arm Exercises
  {
    id: '33',
    name: 'Bicep Curls',
    category: 'Strength',
    muscleGroups: ['Biceps'],
    equipment: 'Dumbbells'
  },
  {
    id: '34',
    name: 'Hammer Curls',
    category: 'Strength',
    muscleGroups: ['Biceps', 'Forearms'],
    equipment: 'Dumbbells'
  },
  {
    id: '35',
    name: 'Tricep Dips',
    category: 'Bodyweight',
    muscleGroups: ['Triceps']
  },
  {
    id: '36',
    name: 'Tricep Extensions',
    category: 'Strength',
    muscleGroups: ['Triceps'],
    equipment: 'Dumbbells'
  },
  {
    id: '37',
    name: 'Close-Grip Bench Press',
    category: 'Strength',
    muscleGroups: ['Triceps', 'Chest'],
    equipment: 'Barbell'
  },
  {
    id: '38',
    name: 'Preacher Curls',
    category: 'Strength',
    muscleGroups: ['Biceps'],
    equipment: 'Barbell'
  },
  {
    id: '39',
    name: 'Cable Tricep Pushdowns',
    category: 'Strength',
    muscleGroups: ['Triceps'],
    equipment: 'Cable Machine'
  },

  // Core Exercises
  {
    id: '40',
    name: 'Plank',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '41',
    name: 'Crunches',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '42',
    name: 'Russian Twists',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '43',
    name: 'Mountain Climbers',
    category: 'Bodyweight',
    muscleGroups: ['Core', 'Legs']
  },
  {
    id: '44',
    name: 'Dead Bug',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '45',
    name: 'Bicycle Crunches',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '46',
    name: 'Leg Raises',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '47',
    name: 'Side Plank',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '48',
    name: 'Hanging Knee Raises',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },

  // Cardio Exercises
  {
    id: '5',
    name: 'Running',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core']
  },
  {
    id: '49',
    name: 'Cycling',
    category: 'Cardio',
    muscleGroups: ['Legs']
  },
  {
    id: '50',
    name: 'Swimming',
    category: 'Cardio',
    muscleGroups: ['Full Body']
  },
  {
    id: '51',
    name: 'Rowing',
    category: 'Cardio',
    muscleGroups: ['Back', 'Legs', 'Core'],
    equipment: 'Rowing Machine'
  },
  {
    id: '52',
    name: 'Burpees',
    category: 'Cardio',
    muscleGroups: ['Full Body']
  },
  {
    id: '53',
    name: 'Jumping Jacks',
    category: 'Cardio',
    muscleGroups: ['Full Body']
  },
  {
    id: '54',
    name: 'High Knees',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core']
  },
  {
    id: '55',
    name: 'Jump Rope',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core'],
    equipment: 'Jump Rope'
  },

  // Functional/Olympic Exercises
  {
    id: '56',
    name: 'Clean and Press',
    category: 'Olympic',
    muscleGroups: ['Full Body'],
    equipment: 'Barbell'
  },
  {
    id: '57',
    name: 'Snatch',
    category: 'Olympic',
    muscleGroups: ['Full Body'],
    equipment: 'Barbell'
  },
  {
    id: '58',
    name: 'Thrusters',
    category: 'Functional',
    muscleGroups: ['Legs', 'Shoulders'],
    equipment: 'Dumbbells'
  },
  {
    id: '59',
    name: 'Kettlebell Swings',
    category: 'Functional',
    muscleGroups: ['Glutes', 'Core', 'Shoulders'],
    equipment: 'Kettlebell'
  },
  {
    id: '60',
    name: 'Turkish Get-ups',
    category: 'Functional',
    muscleGroups: ['Full Body'],
    equipment: 'Kettlebell'
  },
  {
    id: '61',
    name: 'Farmer\'s Walk',
    category: 'Functional',
    muscleGroups: ['Forearms', 'Core', 'Legs'],
    equipment: 'Dumbbells'
  },
  {
    id: '62',
    name: 'Box Jumps',
    category: 'Plyometric',
    muscleGroups: ['Legs'],
    equipment: 'Box'
  },
  {
    id: '63',
    name: 'Medicine Ball Slams',
    category: 'Functional',
    muscleGroups: ['Core', 'Shoulders'],
    equipment: 'Medicine Ball'
  },

  // Stretching/Mobility
  {
    id: '64',
    name: 'Cat-Cow Stretch',
    category: 'Stretching',
    muscleGroups: ['Back', 'Core']
  },
  {
    id: '65',
    name: 'Downward Dog',
    category: 'Stretching',
    muscleGroups: ['Back', 'Hamstrings', 'Calves']
  },
  {
    id: '66',
    name: 'Pigeon Pose',
    category: 'Stretching',
    muscleGroups: ['Hips', 'Glutes']
  },
  {
    id: '67',
    name: 'Hip Flexor Stretch',
    category: 'Stretching',
    muscleGroups: ['Hips']
  },
  {
    id: '68',
    name: 'Shoulder Rolls',
    category: 'Mobility',
    muscleGroups: ['Shoulders']
  },
  {
    id: '69',
    name: 'Foam Rolling',
    category: 'Recovery',
    muscleGroups: ['Full Body'],
    equipment: 'Foam Roller'
  },
  {
    id: '70',
    name: 'Child\'s Pose',
    category: 'Stretching',
    muscleGroups: ['Back', 'Hips']
  },
  {
    id: '7',
    name: 'Incline Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Barbell'
  },
  {
    id: '8',
    name: 'Dumbbell Flyes',
    category: 'Strength',
    muscleGroups: ['Chest'],
    equipment: 'Dumbbells'
  },
  {
    id: '9',
    name: 'Chest Dips',
    category: 'Bodyweight',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders']
  },
  {
    id: '10',
    name: 'Cable Crossover',
    category: 'Strength',
    muscleGroups: ['Chest'],
    equipment: 'Cable Machine'
  },

  // Back Exercises
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