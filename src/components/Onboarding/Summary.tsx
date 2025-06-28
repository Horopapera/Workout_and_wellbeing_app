import React from 'react';
import { User } from '../../types';
import { ChevronLeft, Check, Target, Activity, Heart, Utensils } from 'lucide-react';

interface SummaryProps {
  data: Partial<User>;
  onComplete: () => void;
  onBack: () => void;
}

export default function Summary({ data, onComplete, onBack }: SummaryProps) {
  const calculateCalories = (data: Partial<User>) => {
    if (!data.currentWeight || !data.height || !data.age || !data.gender) return 2000;
    
    let bmr;
    if (data.gender === 'male') {
      bmr = 88.362 + (13.397 * data.currentWeight) + (4.799 * data.height) - (5.677 * data.age);
    } else {
      bmr = 447.593 + (9.247 * data.currentWeight) + (3.098 * data.height) - (4.330 * data.age);
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = bmr * activityMultipliers[data.activityLevel || 'moderate'];

    let calories = tdee;
    if (data.goal === 'lose') calories -= 500;
    if (data.goal === 'gain') calories += 500;

    return Math.round(calories);
  };

  const dailyCalories = calculateCalories(data);
  const macros = {
    protein: Math.round((dailyCalories * 0.25) / 4),
    carbs: Math.round((dailyCalories * 0.45) / 4),
    fat: Math.round((dailyCalories * 0.30) / 9)
  };

  const goalText = {
    lose: 'Lose Weight',
    gain: 'Gain Weight',
    maintain: 'Maintain Weight'
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">You're all set!</h2>
        <p className="text-gray-600">Here's your personalized plan summary</p>
      </div>

      <div className="space-y-4">
        {/* Goal Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-800">Primary Goal</h3>
          </div>
          <p className="text-gray-700">{goalText[data.goal as keyof typeof goalText]}</p>
          {data.targetWeight && (
            <p className="text-sm text-gray-600">Target: {data.targetWeight} kg</p>
          )}
        </div>

        {/* Calorie Target */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Utensils className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-800">Daily Nutrition</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-orange-600">{dailyCalories}</p>
              <p className="text-sm text-gray-600">Daily Calories</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Protein:</span>
                <span className="text-sm font-medium">{macros.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Carbs:</span>
                <span className="text-sm font-medium">{macros.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fat:</span>
                <span className="text-sm font-medium">{macros.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Level */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Activity Level</h3>
          </div>
          <p className="text-gray-700 capitalize">{data.activityLevel?.replace('_', ' ')}</p>
        </div>

        {/* Preferences */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Your Preferences</h3>
          </div>
          <div className="space-y-2">
            {data.dietaryPreferences && data.dietaryPreferences.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700">Diet:</p>
                <p className="text-sm text-gray-600">{data.dietaryPreferences.join(', ')}</p>
              </div>
            )}
            {data.workoutStyle && data.workoutStyle.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700">Workouts:</p>
                <p className="text-sm text-gray-600">{data.workoutStyle.join(', ')}</p>
              </div>
            )}
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
            onClick={onComplete}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
          >
            Complete Setup
            <Check size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}