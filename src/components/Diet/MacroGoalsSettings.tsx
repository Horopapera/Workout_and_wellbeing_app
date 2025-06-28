import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Target, Save, RotateCcw } from 'lucide-react';

interface MacroGoalsSettingsProps {
  onClose: () => void;
}

export default function MacroGoalsSettings({ onClose }: MacroGoalsSettingsProps) {
  const { state, dispatch } = useApp();
  const { user } = state;

  if (!user) return null;

  // Use custom goals if set, otherwise use calculated defaults
  const currentGoals = user.customMacroGoals || {
    calories: user.dailyCalories,
    protein: user.macroTargets.protein,
    carbs: user.macroTargets.carbs,
    fat: user.macroTargets.fat
  };

  const [goals, setGoals] = useState({
    calories: currentGoals.calories.toString(),
    protein: currentGoals.protein.toString(),
    carbs: currentGoals.carbs.toString(),
    fat: currentGoals.fat.toString()
  });

  const handleSave = () => {
    const newGoals = {
      calories: Number(goals.calories),
      protein: Number(goals.protein),
      carbs: Number(goals.carbs),
      fat: Number(goals.fat)
    };

    // Validate inputs
    if (newGoals.calories <= 0 || newGoals.protein < 0 || newGoals.carbs < 0 || newGoals.fat < 0) {
      alert('Please enter valid positive numbers for all fields');
      return;
    }

    dispatch({ type: 'UPDATE_USER_MACRO_GOALS', payload: newGoals });
    onClose();
  };

  const handleReset = () => {
    if (confirm('Reset to calculated defaults based on your profile?')) {
      const defaultGoals = {
        calories: user.dailyCalories.toString(),
        protein: user.macroTargets.protein.toString(),
        carbs: user.macroTargets.carbs.toString(),
        fat: user.macroTargets.fat.toString()
      };
      setGoals(defaultGoals);
    }
  };

  // Calculate percentages for current goals
  const totalCaloriesFromMacros = (Number(goals.protein) * 4) + (Number(goals.carbs) * 4) + (Number(goals.fat) * 9);
  const proteinPercentage = totalCaloriesFromMacros > 0 ? Math.round((Number(goals.protein) * 4 / totalCaloriesFromMacros) * 100) : 0;
  const carbsPercentage = totalCaloriesFromMacros > 0 ? Math.round((Number(goals.carbs) * 4 / totalCaloriesFromMacros) * 100) : 0;
  const fatPercentage = totalCaloriesFromMacros > 0 ? Math.round((Number(goals.fat) * 9 / totalCaloriesFromMacros) * 100) : 0;

  const macroBreakdown = [
    { label: 'Protein', value: goals.protein, percentage: proteinPercentage, color: 'bg-blue-500' },
    { label: 'Carbs', value: goals.carbs, percentage: carbsPercentage, color: 'bg-green-500' },
    { label: 'Fat', value: goals.fat, percentage: fatPercentage, color: 'bg-yellow-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-bold">Macro Goals</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">Set your daily nutrition targets</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Current vs Default Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">About Your Goals</h3>
            <p className="text-sm text-blue-700 mb-2">
              Your default goals are calculated based on your profile: {user.dailyCalories} calories, 
              {user.macroTargets.protein}g protein, {user.macroTargets.carbs}g carbs, {user.macroTargets.fat}g fat.
            </p>
            <p className="text-xs text-blue-600">
              You can customize these targets to match your specific needs or preferences.
            </p>
          </div>

          {/* Goals Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Calories
              </label>
              <input
                type="number"
                value={goals.calories}
                onChange={(e) => setGoals({ ...goals, calories: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="2000"
                min="1000"
                max="5000"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={goals.protein}
                  onChange={(e) => setGoals({ ...goals, protein: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="120"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={goals.carbs}
                  onChange={(e) => setGoals({ ...goals, carbs: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="250"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={goals.fat}
                  onChange={(e) => setGoals({ ...goals, fat: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="60"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Macro Breakdown Visualization */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-3">Macro Breakdown</h3>
            
            {/* Visual Bar */}
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div className="h-full flex">
                <div 
                  className="bg-blue-500 transition-all duration-300"
                  style={{ width: `${proteinPercentage}%` }}
                />
                <div 
                  className="bg-green-500 transition-all duration-300"
                  style={{ width: `${carbsPercentage}%` }}
                />
                <div 
                  className="bg-yellow-500 transition-all duration-300"
                  style={{ width: `${fatPercentage}%` }}
                />
              </div>
            </div>

            {/* Percentages */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              {macroBreakdown.map(macro => (
                <div key={macro.label} className="text-center">
                  <div className={`w-4 h-4 ${macro.color} rounded mx-auto mb-1`} />
                  <div className="font-medium text-gray-800">{macro.label}</div>
                  <div className="text-gray-600">{macro.percentage}%</div>
                  <div className="text-xs text-gray-500">{macro.value}g</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-center text-sm text-gray-600">
              Total from macros: {Math.round(totalCaloriesFromMacros)} calories
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Quick Presets</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const calories = Number(goals.calories);
                  setGoals({
                    ...goals,
                    protein: Math.round(calories * 0.30 / 4).toString(),
                    carbs: Math.round(calories * 0.40 / 4).toString(),
                    fat: Math.round(calories * 0.30 / 9).toString()
                  });
                }}
                className="bg-blue-50 border border-blue-200 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                High Protein
                <div className="text-xs text-blue-600">30/40/30</div>
              </button>
              <button
                onClick={() => {
                  const calories = Number(goals.calories);
                  setGoals({
                    ...goals,
                    protein: Math.round(calories * 0.25 / 4).toString(),
                    carbs: Math.round(calories * 0.45 / 4).toString(),
                    fat: Math.round(calories * 0.30 / 9).toString()
                  });
                }}
                className="bg-green-50 border border-green-200 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
              >
                Balanced
                <div className="text-xs text-green-600">25/45/30</div>
              </button>
              <button
                onClick={() => {
                  const calories = Number(goals.calories);
                  setGoals({
                    ...goals,
                    protein: Math.round(calories * 0.20 / 4).toString(),
                    carbs: Math.round(calories * 0.20 / 4).toString(),
                    fat: Math.round(calories * 0.60 / 9).toString()
                  });
                }}
                className="bg-yellow-50 border border-yellow-200 text-yellow-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
              >
                Low Carb
                <div className="text-xs text-yellow-600">20/20/60</div>
              </button>
              <button
                onClick={() => {
                  const calories = Number(goals.calories);
                  setGoals({
                    ...goals,
                    protein: Math.round(calories * 0.15 / 4).toString(),
                    carbs: Math.round(calories * 0.65 / 4).toString(),
                    fat: Math.round(calories * 0.20 / 9).toString()
                  });
                }}
                className="bg-purple-50 border border-purple-200 text-purple-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                High Carb
                <div className="text-xs text-purple-600">15/65/20</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Goals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}