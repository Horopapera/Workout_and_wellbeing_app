import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Edit3, Trash2, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Workout } from '../../types';
import EmptyState from '../Shared/EmptyState';

interface WorkoutListProps {
  onAddWorkout: () => void;
  onEditWorkout: (workout: Workout) => void;
}

export default function WorkoutList({ onAddWorkout, onEditWorkout }: WorkoutListProps) {
  const { state, dispatch } = useApp();
  const { workouts, currentDate } = state;

  const handleDeleteWorkout = (workoutId: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
    }
  };

  const handleStartWorkout = (workout: Workout) => {
    // Create a new workout instance for today
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      date: currentDate,
      completed: false,
      duration: undefined,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        id: Date.now().toString() + Math.random(),
        sets: ex.sets.map(set => ({ ...set, completed: false }))
      }))
    };
    dispatch({ type: 'ADD_WORKOUT', payload: newWorkout });
  };

  const handleCompleteWorkout = (workout: Workout) => {
    const updatedWorkout = {
      ...workout,
      completed: true,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(set => ({ ...set, completed: true }))
      }))
    };
    dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
  };

  // Separate template workouts from scheduled/completed workouts
  const templateWorkouts = workouts.filter(w => !w.date || w.date === 'template');
  const scheduledWorkouts = workouts.filter(w => w.date && w.date !== 'template');

  if (templateWorkouts.length === 0) {
    return (
      <EmptyState
        icon={Play}
        title="No workout routines yet"
        description="Create your first workout routine to get started with your fitness journey"
        action={{
          label: "Create Workout",
          onClick: onAddWorkout
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Routines */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">My Routines</h2>
          <button
            onClick={onAddWorkout}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            + Add Routine
          </button>
        </div>

        <div className="space-y-3">
          {templateWorkouts.map(workout => (
            <div key={workout.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{workout.name}</h3>
                  <p className="text-sm text-gray-600">
                    {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                  </p>
                  {workout.exercises.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {workout.exercises.map(ex => ex.exercise.name).join(', ')}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditWorkout(workout)}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleStartWorkout(workout)}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                Start Workout
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Scheduled Workouts */}
      {scheduledWorkouts.filter(w => w.date === currentDate).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Workouts</h2>
          <div className="space-y-3">
            {scheduledWorkouts
              .filter(w => w.date === currentDate)
              .map(workout => (
                <div key={workout.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        workout.completed 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {workout.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{workout.name}</h3>
                        <p className="text-sm text-gray-600">
                          {workout.completed ? 'Completed' : 'In Progress'}
                        </p>
                      </div>
                    </div>
                    
                    {!workout.completed && (
                      <button
                        onClick={() => handleCompleteWorkout(workout)}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </div>

                  {workout.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <p className="text-sm text-gray-700">{workout.notes}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}