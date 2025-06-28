import React, { useState } from 'react';
import { User } from '../../types';
import { dietaryPreferences, workoutStyles } from '../../data/mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PreferencesProps {
  data: Partial<User>;
  onUpdate: (data: Partial<User>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Preferences({ data, onUpdate, onNext, onBack }: PreferencesProps) {
  const [selectedDietaryPrefs, setSelectedDietaryPrefs] = useState<string[]>(
    data.dietaryPreferences || []
  );
  const [selectedWorkoutStyles, setSelectedWorkoutStyles] = useState<string[]>(
    data.workoutStyle || []
  );

  const toggleDietaryPref = (pref: string) => {
    setSelectedDietaryPrefs(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const toggleWorkoutStyle = (style: string) => {
    setSelectedWorkoutStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleNext = () => {
    onUpdate({
      dietaryPreferences: selectedDietaryPrefs,
      workoutStyle: selectedWorkoutStyles
    });
    onNext();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Preferences</h2>
        <p className="text-gray-600">Help us tailor your nutrition and workout plans</p>
      </div>

      <div className="space-y-6">
        {/* Dietary Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Dietary Preferences
            <span className="text-sm font-normal text-gray-600 ml-2">(Select all that apply)</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {dietaryPreferences.map(pref => (
              <button
                key={pref}
                onClick={() => toggleDietaryPref(pref)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  selectedDietaryPrefs.includes(pref)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Styles */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Preferred Workout Styles
            <span className="text-sm font-normal text-gray-600 ml-2">(Select all that apply)</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {workoutStyles.map(style => (
              <button
                key={style}
                onClick={() => toggleWorkoutStyle(style)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  selectedWorkoutStyles.includes(style)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-200"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
          >
            Continue
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}