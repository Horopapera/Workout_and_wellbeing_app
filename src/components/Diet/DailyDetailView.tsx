import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Flame, Zap, Wheat, Droplet, Clock } from 'lucide-react';

interface DailyDetailViewProps {
  date: string;
  onClose: () => void;
}

export default function DailyDetailView({ date, onClose }: DailyDetailViewProps) {
  const { state } = useApp();
  const { user, foodEntries, plannedFoodEntries } = state;

  if (!user) return null;

  // Get entries for the selected date
  const dayEntries = foodEntries.filter(entry => entry.date === date);
  const dayPlannedEntries = plannedFoodEntries.filter(entry => entry.date === date);

  // Calculate nutrition totals
  const actualNutrition = dayEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const plannedNutrition = dayPlannedEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Get user targets
  const dailyCalories = user.customMacroGoals?.calories || user.dailyCalories;
  const proteinTarget = user.customMacroGoals?.protein || user.macroTargets.protein;
  const carbsTarget = user.customMacroGoals?.carbs || user.macroTargets.carbs;
  const fatTarget = user.customMacroGoals?.fat || user.macroTargets.fat;

  // Group entries by meal type
  const mealEntries = {
    breakfast: dayEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: dayEntries.filter(entry => entry.mealType === 'lunch'),
    dinner: dayEntries.filter(entry => entry.mealType === 'dinner'),
    snack: dayEntries.filter(entry => entry.mealType === 'snack')
  };

  const plannedMealEntries = {
    breakfast: dayPlannedEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: dayPlannedEntries.filter(entry => entry.mealType === 'lunch'),
    dinner: dayPlannedEntries.filter(entry => entry.mealType === 'dinner'),
    snack: dayPlannedEntries.filter(entry => entry.mealType === 'snack')
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const macros = [
    {
      icon: Flame,
      label: 'Calories',
      actual: Math.round(actualNutrition.calories),
      planned: Math.round(plannedNutrition.calories),
      target: dailyCalories,
      unit: '',
      color: 'text-orange-600'
    },
    {
      icon: Zap,
      label: 'Protein',
      actual: Math.round(actualNutrition.protein),
      planned: Math.round(plannedNutrition.protein),
      target: proteinTarget,
      unit: 'g',
      color: 'text-blue-600'
    },
    {
      icon: Wheat,
      label: 'Carbs',
      actual: Math.round(actualNutrition.carbs),
      planned: Math.round(plannedNutrition.carbs),
      target: carbsTarget,
      unit: 'g',
      color: 'text-green-600'
    },
    {
      icon: Droplet,
      label: 'Fat',
      actual: Math.round(actualNutrition.fat),
      planned: Math.round(plannedNutrition.fat),
      target: fatTarget,
      unit: 'g',
      color: 'text-yellow-600'
    }
  ];

  const meals = [
    { id: 'breakfast', name: 'Breakfast', actual: mealEntries.breakfast, planned: plannedMealEntries.breakfast },
    { id: 'lunch', name: 'Lunch', actual: mealEntries.lunch, planned: plannedMealEntries.lunch },
    { id: 'dinner', name: 'Dinner', actual: mealEntries.dinner, planned: plannedMealEntries.dinner },
    { id: 'snack', name: 'Snacks', actual: mealEntries.snack, planned: plannedMealEntries.snack }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <h2 className="text-xl font-bold">{formatDate(date)}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">Detailed nutrition breakdown</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Nutrition Summary */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              {macros.map(macro => (
                <div key={macro.label} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <macro.icon className={`w-4 h-4 ${macro.color}`} />
                    <span className="text-sm font-medium text-gray-700">{macro.label}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Actual:</span>
                      <span className={`font-medium ${macro.color}`}>
                        {macro.actual}{macro.unit}
                      </span>
                    </div>
                    {dayPlannedEntries.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Planned:</span>
                        <span className="font-medium text-blue-600">
                          {macro.planned}{macro.unit}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium text-gray-800">
                        {macro.target}{macro.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          macro.label === 'Calories' ? 'bg-orange-500' :
                          macro.label === 'Protein' ? 'bg-blue-500' :
                          macro.label === 'Carbs' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min((macro.actual / macro.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Meal Breakdown</h3>
            {meals.map(meal => {
              const hasActual = meal.actual.length > 0;
              const hasPlanned = meal.planned.length > 0;
              
              if (!hasActual && !hasPlanned) return null;

              const actualCalories = meal.actual.reduce((acc, entry) => acc + entry.calories, 0);
              const plannedCalories = meal.planned.reduce((acc, entry) => acc + entry.calories, 0);

              return (
                <div key={meal.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getMealIcon(meal.id)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                      <div className="text-sm text-gray-600">
                        {hasActual && (
                          <span className="text-emerald-600">
                            Logged: {Math.round(actualCalories)} cal
                          </span>
                        )}
                        {hasActual && hasPlanned && <span className="mx-2">•</span>}
                        {hasPlanned && (
                          <span className="text-blue-600">
                            Planned: {Math.round(plannedCalories)} cal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Planned Foods */}
                  {hasPlanned && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-blue-700 mb-2">Planned</h5>
                      <div className="space-y-2">
                        {meal.planned.map(entry => (
                          <div key={entry.id} className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-sm font-medium text-blue-800">{entry.food.name}</span>
                                <div className="text-xs text-blue-600">
                                  {entry.amount}g • {Math.round(entry.calories)} cal
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actual Foods */}
                  {hasActual && (
                    <div>
                      <h5 className="text-sm font-medium text-emerald-700 mb-2">Logged</h5>
                      <div className="space-y-2">
                        {meal.actual.map(entry => (
                          <div key={entry.id} className="bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-sm font-medium text-emerald-800">{entry.food.name}</span>
                                <div className="text-xs text-emerald-600">
                                  {entry.amount}g • {Math.round(entry.calories)} cal
                                </div>
                              </div>
                              {entry.createdAt && (
                                <div className="flex items-center gap-1 text-xs text-emerald-600">
                                  <Clock className="w-3 h-3" />
                                  {new Date(entry.createdAt).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Day Summary */}
          {dayEntries.length === 0 && dayPlannedEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Data for This Day</h3>
              <p className="text-sm">No meals were logged or planned for this date</p>
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
  );
}