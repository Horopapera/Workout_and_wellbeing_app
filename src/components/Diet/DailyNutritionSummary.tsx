import React from 'react';
import { Flame, Zap, Wheat, Droplet } from 'lucide-react';
import { User } from '../../types';

interface DailyNutritionSummaryProps {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  plannedNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  targets: User;
  selectedDate: string;
  showComparison?: boolean;
}

export default function DailyNutritionSummary({ nutrition, plannedNutrition, targets, selectedDate, showComparison = false }: DailyNutritionSummaryProps) {
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  
  // Use custom macro goals if set, otherwise use calculated targets
  const dailyCalories = targets.customMacroGoals?.calories || targets.dailyCalories;
  const proteinTarget = targets.customMacroGoals?.protein || targets.macroTargets.protein;
  const carbsTarget = targets.customMacroGoals?.carbs || targets.macroTargets.carbs;
  const fatTarget = targets.customMacroGoals?.fat || targets.macroTargets.fat;
  
  const macros = [
    {
      icon: Flame,
      label: 'Calories',
      value: Math.round(nutrition.calories),
      target: dailyCalories,
      unit: '',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Zap,
      label: 'Protein',
      value: Math.round(nutrition.protein),
      target: proteinTarget,
      unit: 'g',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Wheat,
      label: 'Carbs',
      value: Math.round(nutrition.carbs),
      target: carbsTarget,
      unit: 'g',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Droplet,
      label: 'Fat',
      value: Math.round(nutrition.fat),
      target: fatTarget,
      unit: 'g',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'text-emerald-600';
    if (percentage >= 80) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getRemainingText = (value: number, target: number, unit: string) => {
    const remaining = Math.max(0, target - value);
    if (remaining === 0) return 'Goal reached!';
    return `${remaining}${unit} remaining`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {isToday ? "Today's" : "Daily"} Nutrition
        </h2>
        <div className="text-sm text-gray-600">
          {Math.round(nutrition.calories)} / {dailyCalories} cal
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {macros.map(({ icon: Icon, label, value, target, unit, color, bgColor }) => {
          const progress = Math.min((value / target) * 100, 100);
          
          return (
            <div key={label} className={`${bgColor} p-4 rounded-xl`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-800">{value}</span>
                  <span className="text-sm text-gray-600">/ {target}{unit}</span>
                </div>
                
                <div className="w-full bg-white rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className={`text-xs font-medium ${getProgressColor(value, target)}`}>
                  {getRemainingText(value, target, unit)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Planned vs Actual Comparison */}
      {showComparison && plannedNutrition && (
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Planned vs Actual</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Planned</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Calories:</span>
                  <span className="font-medium text-blue-800">{Math.round(plannedNutrition.calories)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Protein:</span>
                  <span className="font-medium text-blue-800">{Math.round(plannedNutrition.protein)}g</span>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-emerald-800 mb-2">Actual</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Calories:</span>
                  <span className="font-medium text-emerald-800">{Math.round(nutrition.calories)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Protein:</span>
                  <span className="font-medium text-emerald-800">{Math.round(nutrition.protein)}g</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Variance */}
          <div className="mt-3 text-center">
            <div className="text-sm text-gray-600">
              Variance: 
              <span className={`ml-1 font-medium ${
                Math.abs(nutrition.calories - plannedNutrition.calories) <= 50 
                  ? 'text-emerald-600' 
                  : 'text-orange-600'
              }`}>
                {nutrition.calories > plannedNutrition.calories ? '+' : ''}
                {Math.round(nutrition.calories - plannedNutrition.calories)} cal
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-800 mb-2">Quick Insights</h3>
        <div className="space-y-1">
          {nutrition.calories < dailyCalories * 0.5 && (
            <p className="text-sm text-orange-600">🍽️ You're under 50% of your calorie goal</p>
          )}
          {nutrition.protein >= proteinTarget && (
            <p className="text-sm text-emerald-600">💪 Protein goal achieved!</p>
          )}
          {nutrition.calories > dailyCalories * 1.1 && (
            <p className="text-sm text-red-600">⚠️ You've exceeded your calorie goal</p>
          )}
          {nutrition.calories === 0 && (
            <p className="text-sm text-gray-600">📝 Start logging your meals to track progress</p>
          )}
        </div>
      </div>
    </div>
  );
}