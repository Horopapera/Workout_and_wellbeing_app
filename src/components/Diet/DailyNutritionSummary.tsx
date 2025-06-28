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
  targets: User;
  selectedDate: string;
}

export default function DailyNutritionSummary({ nutrition, targets, selectedDate }: DailyNutritionSummaryProps) {
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  
  const macros = [
    {
      icon: Flame,
      label: 'Calories',
      value: Math.round(nutrition.calories),
      target: targets.dailyCalories,
      unit: '',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Zap,
      label: 'Protein',
      value: Math.round(nutrition.protein),
      target: targets.macroTargets.protein,
      unit: 'g',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Wheat,
      label: 'Carbs',
      value: Math.round(nutrition.carbs),
      target: targets.macroTargets.carbs,
      unit: 'g',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Droplet,
      label: 'Fat',
      value: Math.round(nutrition.fat),
      target: targets.macroTargets.fat,
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
          {Math.round(nutrition.calories)} / {targets.dailyCalories} cal
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

      {/* Quick Insights */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-800 mb-2">Quick Insights</h3>
        <div className="space-y-1">
          {nutrition.calories < targets.dailyCalories * 0.5 && (
            <p className="text-sm text-orange-600">🍽️ You're under 50% of your calorie goal</p>
          )}
          {nutrition.protein >= targets.macroTargets.protein && (
            <p className="text-sm text-emerald-600">💪 Protein goal achieved!</p>
          )}
          {nutrition.calories > targets.dailyCalories * 1.1 && (
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