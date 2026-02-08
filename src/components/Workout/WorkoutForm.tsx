import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { Workout, WorkoutExercise } from '../../types';
import ExerciseForm from './ExerciseForm';

interface WorkoutFormProps {
  workout?: Workout | null;
  onClose: () => void;
}

export default function WorkoutForm({ workout, onClose }: WorkoutFormProps) {
  const { dispatch } = useApp();
  const [name, setName] = useState(workout?.name || '');
  const [exercises, setExercises] = useState<WorkoutExercise[]>(workout?.exercises || []);
  const [notes, setNotes] = useState(workout?.notes || '');

  const handleAddExercise = () => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      exerciseId: '',
      exercise: {
        id: '',
        name: '',
        category: 'Strength',
        muscleGroups: []
      },
      sets: [
        {
          id: Date.now().toString() + '1',
          reps: 8,
          weight: 0,
          completed: false
        }
      ]
    };
    setExercises([...exercises, newExercise]);
  };

  const handleUpdateExercise = (index: number, updatedExercise: WorkoutExercise) => {
    const newExercises = [...exercises];
    newExercises[index] = updatedExercise;
    setExercises(newExercises);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const workoutData: Workout = {
      id: workout?.id || Date.now().toString(),
      name: name.trim(),
      exercises,
      date: workout?.date || 'template',
      completed: workout?.completed || false,
      notes: notes.trim() || undefined
    };

    if (workout) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: workoutData });
    } else {
      dispatch({ type: 'ADD_WORKOUT', payload: workoutData });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {workout ? 'Edit Workout' : 'New Workout'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
          {/* Workout Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="e.g., Push Day, Full Body, Legs"
            />
          </div>

          {/* Exercises */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Exercises</h3>

            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-gray-50 rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Exercise {index + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveExercise(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <ExerciseForm
                    exercise={exercise}
                    onChange={(updatedExercise) => handleUpdateExercise(index, updatedExercise)}
                  />
                </div>
              ))}
              
              {/* Add Exercise Button - appears after all exercises */}
              <button
                onClick={handleAddExercise}
                className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Exercise
              </button>
            </div>

            {exercises.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No exercises added yet</p>
                <p className="text-sm">Click "Add Exercise" below to get started</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              rows={3}
              placeholder="Any notes about this workout..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || exercises.length === 0}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                !name.trim() || exercises.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}