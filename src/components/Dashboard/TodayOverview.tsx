import React from 'react';
import { Calendar, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { User, Workout } from '../../types';

interface TodayOverviewProps {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  targets: User;
  workouts: Workout[];
  completedWorkouts: number;
}

export default function TodayOverview({ nutrition, targets, workouts, completedWorkouts }: TodayOverviewProps) {
  const caloriesRemaining = Math.max(0, targets.dailyCalories - nutrition.calories);
  const proteinRemaining = Math.max(0, targets.macroTargets.protein - nutrition.protein);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-gray-800">Today's Overview</h2>
      </div>

      <div className="space-y-4">
        {/* Nutrition Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">Nutrition Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Calories Remaining</span>
              </div>
              <p className="text-xl font-bold text-orange-600">{Math.round(caloriesRemaining)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Protein Remaining</span>
              </div>
              <p className="text-xl font-bold text-blue-600">{Math.round(proteinRemaining)}g</p>
            </div>
          </div>
        </div>

        {/* Workout Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">Workout Status</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {completedWorkouts > 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Clock className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {completedWorkouts > 0 
                  ? `${completedWorkouts} workout${completedWorkouts > 1 ? 's' : ''} completed` 
                  : 'No workouts completed'}
              </span>
            </div>
            {workouts.length > completedWorkouts && (
              <span className="text-sm text-gray-500">
                {workouts.length - completedWorkouts} pending
              </span>
            )}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-2">Quick Insights</h3>
          <div className="space-y-2">
            {caloriesRemaining > 200 && (
              <p className="text-sm text-gray-600">💡 You have {Math.round(caloriesRemaining)} calories left for today</p>
            )}
            {proteinRemaining > 10 && (
              <p className="text-sm text-gray-600">🥩 Consider adding {Math.round(proteinRemaining)}g more protein</p>
            )}
            {completedWorkouts === 0 && (
              <p className="text-sm text-gray-600">💪 Don't forget to log your workout today!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}