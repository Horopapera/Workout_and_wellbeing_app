import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Play, CheckCircle2, Clock, Trash2, Calendar } from 'lucide-react';
import { Workout } from '../../types';
import WorkoutScheduler from './WorkoutScheduler';

interface DayWorkoutViewProps {
  date: string;
  onClose: () => void;
}

export default function DayWorkoutView({ date, onClose }: DayWorkoutViewProps) {
  const { state, dispatch } = useApp();
  const { workouts } = state;
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Get workouts for this specific day
  const dayWorkouts = workouts.filter(w => w.date === date);
  
  // Get template workouts (for adding new ones)
  const templateWorkouts = workouts.filter(w => !w.date || w.date === 'template');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteWorkout = (workoutId: string) => {
    if (confirm('Are you sure you want to remove this workout from this day?')) {
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
    }
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

  const handleAddWorkout = (templateWorkout: Workout) => {
    const newWorkout: Workout = {
      ...templateWorkout,
      id: `${templateWorkout.id}-${date}-${Date.now()}`,
      date: date,
      completed: false,
      exercises: templateWorkout.exercises.map(ex => ({
        ...ex,
        id: `${ex.id}-${Date.now()}-${Math.random()}`,
        sets: ex.sets.map(set => ({ ...set, completed: false }))
      }))
    };
    dispatch({ type: 'ADD_WORKOUT', payload: newWorkout });
  };

  const handleScheduleFromTemplate = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowScheduler(true);
  };

  const isToday = date === new Date().toISOString().split('T')[0];
  const isPast = new Date(date) < new Date(new Date().toISOString().split('T')[0]);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">
                {isToday ? 'Today' : isPast ? 'Past Day' : 'Upcoming Day'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/80">{formatDate(date)}</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Scheduled Workouts */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Scheduled Workouts ({dayWorkouts.length})
              </h3>
              
              {dayWorkouts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">No workouts scheduled</p>
                  <p className="text-sm">Add a workout from your routines below</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayWorkouts.map(workout => (
                    <div key={workout.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            workout.completed 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'bg-orange-100 text-orange-600'
                          }`}>
                            {workout.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{workout.name}</h4>
                            <p className="text-sm text-gray-600">
                              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                              {workout.duration && ` • ${workout.duration} min`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!workout.completed && !isPast && (
                            <button
                              onClick={() => handleCompleteWorkout(workout)}
                              className="bg-emerald-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-emerald-600 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteWorkout(workout.id)}
                            className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Exercise List */}
                      <div className="space-y-2">
                        {workout.exercises.map(exercise => (
                          <div key={exercise.id} className="bg-white rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{exercise.exercise.name}</span>
                              <span className="text-sm text-gray-600">
                                {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                              </span>
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
                  ))}
                </div>
              )}
            </div>

            {/* Add Workout Section */}
            {!isPast && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Workout</h3>
                
                {templateWorkouts.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No workout routines available</p>
                    <p className="text-sm">Create a routine first in the Routines tab</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {templateWorkouts.map(workout => (
                      <div key={workout.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{workout.name}</h4>
                            <p className="text-sm text-gray-600">
                              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddWorkout(workout)}
                            className="flex-1 bg-emerald-500 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add for {isToday ? 'Today' : 'This Day'}
                          </button>
                          <button
                            onClick={() => handleScheduleFromTemplate(workout)}
                            className="bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                          >
                            Schedule
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Workout Scheduler Modal */}
      {showScheduler && selectedWorkout && (
        <WorkoutScheduler
          workout={selectedWorkout}
          onClose={() => {
            setShowScheduler(false);
            setSelectedWorkout(null);
          }}
        />
      )}
    </>
  );
}