import React from 'react';
import { useApp } from '../../context/AppContext';
import DashboardHeader from './DashboardHeader';
import QuickStats from './QuickStats';
import TodayOverview from './TodayOverview';
import QuickActions from './QuickActions';
import WorkoutQuickStart from './WorkoutQuickStart';

interface DashboardProps {
  onStartWorkout?: (workout: any) => void;
}

export default function Dashboard({ onStartWorkout }: DashboardProps) {
  const { state } = useApp();
  const [showWorkoutQuickStart, setShowWorkoutQuickStart] = useState(false);
  const { user, foodEntries, workouts, wellnessEntries, currentDate } = state;

  if (!user) return null;

  // Calculate today's nutrition
  const todayEntries = foodEntries.filter(entry => entry.date === currentDate);
  const todayNutrition = todayEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate today's workouts
  const todayWorkouts = workouts.filter(w => w.date === currentDate);
  const completedWorkouts = todayWorkouts.filter(w => w.completed);

  // Get today's wellness data
  const todayWellness = wellnessEntries.find(w => w.date === currentDate);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      <DashboardHeader user={user} />
      
      <div className="px-4 space-y-6">
        <QuickStats 
          nutrition={todayNutrition}
          targets={user}
          workouts={completedWorkouts.length}
          water={todayWellness?.waterIntake || 0}
        />
        
        <TodayOverview 
          nutrition={todayNutrition}
          targets={user}
          workouts={todayWorkouts}
          completedWorkouts={completedWorkouts.length}
        />
        
        <QuickActions onStartWorkout={() => setShowWorkoutQuickStart(true)} />
      </div>
      
      {/* Workout Quick Start Modal */}
      {showWorkoutQuickStart && (
        <WorkoutQuickStart
          onClose={() => setShowWorkoutQuickStart(false)}
          onStartWorkout={(workout) => {
            setShowWorkoutQuickStart(false);
            onStartWorkout?.(workout);
          }}
        />
      )}
    </div>
  );
}