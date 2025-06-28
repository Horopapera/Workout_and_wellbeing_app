import React from 'react';
import { Target, TrendingUp, Award, Calendar, Flame, Zap } from 'lucide-react';

interface ComplianceStatsPanelProps {
  calorieComplianceRate: number;
  proteinComplianceRate: number;
  currentStreak: number;
  bestStreak: number;
  totalDays: number;
  period: 'week' | 'month' | '3months';
}

export default function ComplianceStatsPanel({
  calorieComplianceRate,
  proteinComplianceRate,
  currentStreak,
  bestStreak,
  totalDays,
  period
}: ComplianceStatsPanelProps) {
  const periodLabels = {
    week: 'Last 7 Days',
    month: 'Last 30 Days',
    '3months': 'Last 3 Months'
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 80) return 'text-emerald-600 bg-emerald-100';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return 'text-purple-600 bg-purple-100';
    if (streak >= 3) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calorie Compliance */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getComplianceColor(calorieComplianceRate)}`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Calorie Goals</h3>
              <p className="text-sm text-gray-600">{periodLabels[period]}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-800">{Math.round(calorieComplianceRate)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(calorieComplianceRate, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {Math.round((calorieComplianceRate / 100) * totalDays)} of {totalDays} days on target
            </p>
          </div>
        </div>

        {/* Protein Compliance */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getComplianceColor(proteinComplianceRate)}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Protein Goals</h3>
              <p className="text-sm text-gray-600">{periodLabels[period]}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-800">{Math.round(proteinComplianceRate)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(proteinComplianceRate, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {Math.round((proteinComplianceRate / 100) * totalDays)} of {totalDays} days on target
            </p>
          </div>
        </div>
      </div>

      {/* Streaks */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Goal Streaks</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${getStreakColor(currentStreak)}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-xs text-gray-500 mt-1">
              {currentStreak === 1 ? 'day' : 'days'} on target
            </div>
          </div>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${getStreakColor(bestStreak)}`}>
              <Award className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{bestStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
            <div className="text-xs text-gray-500 mt-1">
              {bestStreak === 1 ? 'day' : 'days'} record
            </div>
          </div>
        </div>

        {/* Streak Motivation */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          {currentStreak === 0 ? (
            <p className="text-sm text-purple-700 text-center">
              🎯 Start a new streak by hitting your calorie goal today!
            </p>
          ) : currentStreak >= 7 ? (
            <p className="text-sm text-purple-700 text-center">
              🔥 Amazing! You're on fire with a {currentStreak}-day streak!
            </p>
          ) : currentStreak >= 3 ? (
            <p className="text-sm text-blue-700 text-center">
              💪 Great momentum! Keep it up to reach a week-long streak!
            </p>
          ) : (
            <p className="text-sm text-blue-700 text-center">
              ⭐ Good start! Aim for 3 days in a row to build momentum!
            </p>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Days Tracked</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{totalDays}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Overall Compliance</span>
            </div>
            <span className="text-sm font-bold text-emerald-600">
              {Math.round((calorieComplianceRate + proteinComplianceRate) / 2)}%
            </span>
          </div>

          {totalDays >= 7 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Consistency Rating</span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {calorieComplianceRate >= 80 ? 'Excellent' : 
                 calorieComplianceRate >= 60 ? 'Good' : 
                 calorieComplianceRate >= 40 ? 'Fair' : 'Needs Work'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}