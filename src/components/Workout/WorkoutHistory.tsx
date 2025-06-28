import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, TrendingUp, Award, Clock, CheckCircle2, Flame, Timer, Play, Square } from 'lucide-react';
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

  // Calculate additional stats
  const totalCaloriesBurned = completedWorkouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);
  const totalWorkoutTime = completedWorkouts.reduce((acc, w) => acc + (w.duration || 0), 0);
  const averageWorkoutDuration = totalWorkouts > 0 ? Math.round(totalWorkoutTime / totalWorkouts) : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
      {/* Primary Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalWorkouts}</div>
          <div className="text-sm text-gray-600">Total Workouts</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{currentStreak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Secondary Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Flame className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-lg font-bold text-gray-800">{totalCaloriesBurned}</div>
          <div className="text-xs text-gray-600">Calories Burned</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Timer className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-gray-800">{formatDuration(totalWorkoutTime)}</div>
          <div className="text-xs text-gray-600">Total Time</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-gray-800">{averageWorkoutDuration}m</div>
          <div className="text-xs text-gray-600">Avg Duration</div>
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
                    <p className="text-sm text-gray-600 mb-1">{formatDate(workout.date!)}</p>
                    
                    {/* Workout Analytics */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {workout.startTime && workout.endTime && (
                        <div className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          <span>{formatTime(workout.startTime)}</span>
                          <span>-</span>
                          <Square className="w-3 h-3" />
                          <span>{formatTime(workout.endTime)}</span>
                        </div>
                      )}
                      {workout.duration && (
                        <div className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          <span>{workout.duration}m</span>
                        </div>
                      )}
                      {workout.caloriesBurned && (
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>{workout.caloriesBurned} cal</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-800">{workout.exercises.length}</div>
                      <div className="text-xs text-gray-600">Exercises</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        {workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}
                      </div>
                      <div className="text-xs text-gray-600">Total Sets</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        {workout.exercises.reduce((acc, ex) => 
                          acc + ex.sets.reduce((setAcc, set) => setAcc + set.reps, 0), 0
                        )}
                      </div>
                      <div className="text-xs text-gray-600">Total Reps</div>
                    </div>
                  </div>
                </div>

                {/* Exercise Summary */}
                <div className="space-y-2">
                  {workout.exercises.map(exercise => (
                    <div key={exercise.id} className="bg-white border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{exercise.exercise.name}</span>
                        <span className="text-sm text-gray-600">
                          {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-sm">
                        {exercise.sets.map((set, index) => (
                          <div key={set.id} className="bg-gray-50 rounded px-2 py-1">
                            <span className="text-gray-600 text-xs">Set {index + 1}:</span>
                            <span className="font-medium ml-1">
                              {set.reps}r{set.weight ? ` @ ${set.weight}kg` : ''}
                            </span>
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
        
        {/* Weekly Summary */}
        {selectedPeriod === 'week' && filteredWorkouts.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">This Week's Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {filteredWorkouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Calories Burned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatDuration(filteredWorkouts.reduce((acc, w) => acc + (w.duration || 0), 0))}
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}