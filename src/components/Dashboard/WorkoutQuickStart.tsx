import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Play, Dumbbell, Clock } from 'lucide-react';
import { Workout } from '../../types';

interface WorkoutQuickStartProps {
  onClose: () => void;
  onStartWorkout: (workout: Workout) => void;
}

export default function WorkoutQuickStart({ onClose, onStartWorkout }: WorkoutQuickStartProps) {
  const { state } = useApp();
  const { workouts, currentDate } = state;

  // Get template workouts (routines)
  const templateWorkouts = workouts.filter(w => !w.date || w.date === 'template');

  const handleStartWorkout = (templateWorkout: Workout) => {
    // Create a new workout instance for today
    const sessionWorkout: Workout = {
      ...templateWorkout,
      id: Date.now().toString(),
      date: currentDate,
      completed: false,
      duration: undefined,
      exercises: templateWorkout.exercises.map(ex => ({
        ...ex,
        id: Date.now().toString() + Math.random(),
        sets: ex.sets.map(set => ({ ...set, completed: false }))
      }))
    };
    onStartWorkout(sessionWorkout);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[70vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Quick Start Workout</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">Choose a routine to start immediately</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {templateWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Routines Available</h3>
              <p className="text-gray-600 mb-6">Create your first workout routine to get started</p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
              >
                Go to Workouts
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {templateWorkouts.map(workout => (
                <div key={workout.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{workout.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Dumbbell className="w-4 h-4" />
                          <span>{workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>~{workout.exercises.length * 8} min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exercise Preview */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Exercises:</div>
                    <div className="flex flex-wrap gap-1">
                      {workout.exercises.slice(0, 3).map(exercise => (
                        <span key={exercise.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {exercise.exercise.name}
                        </span>
                      ))}
                      {workout.exercises.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{workout.exercises.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => handleStartWorkout(workout)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
                  >
                    <Play className="w-4 h-4" />
                    Start Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}