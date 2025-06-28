import React, { useState } from 'react';
import { WorkoutExercise, WorkoutSet } from '../../types';
import { Plus, Trash2, Search } from 'lucide-react';
import { mockExercises } from '../../data/mockData';

interface ExerciseFormProps {
  exercise: WorkoutExercise;
  onChange: (exercise: WorkoutExercise) => void;
}

export default function ExerciseForm({ exercise, onChange }: ExerciseFormProps) {
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = mockExercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.muscleGroups.some(mg => mg.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExerciseSelect = (selectedExercise: any) => {
    onChange({
      ...exercise,
      exerciseId: selectedExercise.id,
      exercise: selectedExercise
    });
    setShowExerciseSearch(false);
    setSearchTerm('');
  };

  const handleCustomExerciseName = (name: string) => {
    onChange({
      ...exercise,
      exercise: {
        ...exercise.exercise,
        id: 'custom-' + Date.now(),
        name
      }
    });
  };

  const handleAddSet = () => {
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      reps: 8,
      weight: 0,
      completed: false
    };
    onChange({
      ...exercise,
      sets: [...exercise.sets, newSet]
    });
  };

  const handleUpdateSet = (setIndex: number, updatedSet: WorkoutSet) => {
    const newSets = [...exercise.sets];
    newSets[setIndex] = updatedSet;
    onChange({
      ...exercise,
      sets: newSets
    });
  };

  const handleRemoveSet = (setIndex: number) => {
    if (exercise.sets.length > 1) {
      onChange({
        ...exercise,
        sets: exercise.sets.filter((_, i) => i !== setIndex)
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Exercise Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exercise Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={exercise.exercise.name}
            onChange={(e) => handleCustomExerciseName(e.target.value)}
            onFocus={() => setShowExerciseSearch(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-10"
            placeholder="Search or enter exercise name"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Exercise Search Dropdown */}
        {showExerciseSearch && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                placeholder="Search exercises..."
                autoFocus
              />
            </div>
            <div className="max-h-32 overflow-y-auto">
              {filteredExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => handleExerciseSelect(ex)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-800">{ex.name}</div>
                  <div className="text-sm text-gray-600">{ex.category} • {ex.muscleGroups.join(', ')}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowExerciseSearch(false)}
              className="w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 border-t border-gray-200"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Sets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Sets</label>
          <button
            onClick={handleAddSet}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Set
          </button>
        </div>

        <div className="space-y-2">
          {exercise.sets.map((set, setIndex) => (
            <div key={set.id} className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
              <span className="text-sm font-medium text-gray-600 w-8">
                {setIndex + 1}
              </span>
              
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Reps</label>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleUpdateSet(setIndex, { ...set, reps: Number(e.target.value) })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => handleUpdateSet(setIndex, { ...set, weight: Number(e.target.value) || undefined })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    min="0"
                    step="0.5"
                    placeholder="0"
                  />
                </div>
              </div>

              {exercise.sets.length > 1 && (
                <button
                  onClick={() => handleRemoveSet(setIndex)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exercise Notes (Optional)
        </label>
        <textarea
          value={exercise.notes || ''}
          onChange={(e) => onChange({ ...exercise, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
          rows={2}
          placeholder="Rest time, form cues, etc..."
        />
      </div>
    </div>
  );
}