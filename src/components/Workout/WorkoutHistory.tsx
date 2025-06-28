import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, TrendingUp, Award, Clock, CheckCircle2 } from 'lucide-react';
import EmptyState from '../Shared/EmptyState';

export default function WorkoutHistory() {
  const { state } = useApp();
  const { workouts } = state;
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  // Filter completed workouts
  const completedWorkouts = workouts.filter(w => w.completed && w.date && w.date !== 'template');

  // Sort by date (most recent first)
  const sortedWorkouts = completedWorkouts.sort((a, b) => 
    new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );

  // Filter by selected period
  const now = new Date();
  const filteredWorkouts = sortedWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date!);
    const diffTime = now.getTime() - workoutDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (selectedPeriod) {
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      default:
        return true;
    }
  });

  // Calculate stats
  const totalWorkouts = completedWorkouts.length;
  const thisWeekWorkouts = completedWorkouts.filter(w => {
    const workoutDate = new Date(w.date!);
    const diffTime = now.getTime() - workoutDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const averageWorkoutsPerWeek = totalWorkouts > 0 ? Math.round((totalWorkouts / 4) * 10) / 10 : 0;

  // Calculate current streak
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasWorkout = completedWorkouts.some(w => w.date === dateStr);
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' }
  ];

  if (completedWorkouts.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No workout history yet"
        description="Complete your first workout to start tracking your progress and building your fitness journey"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalWorkouts}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{thisWeekWorkouts}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{currentStreak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          {periods.map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Workout History List */}
        <div className="space-y-3">
          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No workouts in this period</p>
            </div>
          ) : (
            filteredWorkouts.map(workout => (
              <div key={workout.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{workout.name}</h3>
                    <p className="text-sm text-gray-600">{formatDate(workout.date!)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {workout.duration && (
                      <span className="text-sm text-gray-600">{workout.duration}m</span>
                    )}
                  </div>
                </div>

                {/* Exercise Summary */}
                <div className="space-y-2">
                  {workout.exercises.map(exercise => (
                    <div key={exercise.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{exercise.exercise.name}</span>
                        <span className="text-sm text-gray-600">
                          {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {exercise.sets.map((set, index) => (
                          <div key={set.id} className="text-center">
                            <div className="text-gray-600">Set {index + 1}</div>
                            <div className="font-medium">
                              {set.reps} reps
                              {set.weight && ` @ ${set.weight}kg`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {workout.notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{workout.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}