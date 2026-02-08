import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';
import DietHistoryCalendar from './DietHistoryCalendar';
import NutritionTrendChart from './NutritionTrendChart';
import ComplianceStatsPanel from './ComplianceStatsPanel';
import DailyDetailView from './DailyDetailView';

export default function DietHistory() {
  const { state } = useApp();
  const { user, foodEntries } = state;
  const [activeView, setActiveView] = useState<'calendar' | 'trends' | 'insights'>('calendar');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | '3months'>('week');
  const [selectedDetailDate, setSelectedDetailDate] = useState<string | null>(null);

  if (!user) return null;

  // Get user's macro targets
  const dailyCalories = user.customMacroGoals?.calories || user.dailyCalories;
  const proteinTarget = user.customMacroGoals?.protein || user.macroTargets.protein;
  const carbsTarget = user.customMacroGoals?.carbs || user.macroTargets.carbs;
  const fatTarget = user.customMacroGoals?.fat || user.macroTargets.fat;

  // Calculate date range based on selected period
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setDate(end.getDate() - 30);
        break;
      case '3months':
        start.setDate(end.getDate() - 90);
        break;
    }
    
    return { start, end };
  };

  const { start: startDate, end: endDate } = getDateRange();

  // Filter entries within date range
  const periodEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= endDate;
  });

  // Group entries by date
  const entriesByDate = periodEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, typeof foodEntries>);

  // Calculate daily nutrition data
  const dailyNutritionData = Object.entries(entriesByDate).map(([date, entries]) => {
    const nutrition = entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      date,
      ...nutrition,
      calorieTarget: dailyCalories,
      proteinTarget,
      carbsTarget,
      fatTarget,
      calorieCompliance: (nutrition.calories / dailyCalories) * 100,
      proteinCompliance: (nutrition.protein / proteinTarget) * 100
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate overall stats
  const totalDays = dailyNutritionData.length;
  const avgCalories = totalDays > 0 ? dailyNutritionData.reduce((acc, day) => acc + day.calories, 0) / totalDays : 0;
  const avgProtein = totalDays > 0 ? dailyNutritionData.reduce((acc, day) => acc + day.protein, 0) / totalDays : 0;
  
  // Calculate compliance rates
  const calorieCompliantDays = dailyNutritionData.filter(day => 
    day.calories >= dailyCalories * 0.9 && day.calories <= dailyCalories * 1.1
  ).length;
  const proteinCompliantDays = dailyNutritionData.filter(day => 
    day.protein >= proteinTarget * 0.9
  ).length;

  const calorieComplianceRate = totalDays > 0 ? (calorieCompliantDays / totalDays) * 100 : 0;
  const proteinComplianceRate = totalDays > 0 ? (proteinCompliantDays / totalDays) * 100 : 0;

  // Calculate streaks
  const calculateCurrentStreak = () => {
    let streak = 0;
    const sortedDays = [...dailyNutritionData].reverse();
    
    for (const day of sortedDays) {
      if (day.calories >= dailyCalories * 0.9 && day.calories <= dailyCalories * 1.1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateCurrentStreak();

  // Calculate best streak
  const calculateBestStreak = () => {
    let bestStreak = 0;
    let currentStreakCount = 0;
    
    for (const day of dailyNutritionData) {
      if (day.calories >= dailyCalories * 0.9 && day.calories <= dailyCalories * 1.1) {
        currentStreakCount++;
        bestStreak = Math.max(bestStreak, currentStreakCount);
      } else {
        currentStreakCount = 0;
      }
    }
    
    return bestStreak;
  };

  const bestStreak = calculateBestStreak();

  const views = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: BarChart3 }
  ];

  const periods = [
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
    { id: '3months', label: 'Last 3 Months' }
  ];

  return (
    <div className="space-y-6">
      {/* View Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeView === view.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>

        {/* Period Selector for Trends and Insights */}
        {(activeView === 'trends' || activeView === 'insights') && (
          <div className="flex gap-2">
            {periods.map(period => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period.id
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content based on active view */}
      {activeView === 'calendar' && (
        <DietHistoryCalendar
          onDateSelect={setSelectedDetailDate}
        />
      )}

      {activeView === 'trends' && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{Math.round(avgCalories)}</div>
              <div className="text-sm text-gray-600">Avg Daily Calories</div>
              <div className="text-xs text-gray-500 mt-1">Target: {dailyCalories}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{Math.round(avgProtein)}g</div>
              <div className="text-sm text-gray-600">Avg Daily Protein</div>
              <div className="text-xs text-gray-500 mt-1">Target: {proteinTarget}g</div>
            </div>
          </div>

          <NutritionTrendChart
            data={dailyNutritionData}
            period={selectedPeriod}
          />
        </div>
      )}

      {activeView === 'insights' && (
        <div className="space-y-6">
          <ComplianceStatsPanel
            calorieComplianceRate={calorieComplianceRate}
            proteinComplianceRate={proteinComplianceRate}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            totalDays={totalDays}
            period={selectedPeriod}
          />

          {/* Quick Insights */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Insights</h3>
            <div className="space-y-3">
              {avgCalories < dailyCalories * 0.9 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-800">
                    📊 You're averaging {Math.round(dailyCalories - avgCalories)} calories below your target
                  </p>
                </div>
              )}
              
              {avgCalories > dailyCalories * 1.1 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    ⚠️ You're averaging {Math.round(avgCalories - dailyCalories)} calories above your target
                  </p>
                </div>
              )}

              {proteinComplianceRate >= 80 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-sm text-emerald-800">
                    💪 Great job! You're hitting your protein target {Math.round(proteinComplianceRate)}% of the time
                  </p>
                </div>
              )}

              {proteinComplianceRate < 50 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    🥩 Consider focusing on protein - you're only hitting your target {Math.round(proteinComplianceRate)}% of the time
                  </p>
                </div>
              )}

              {currentStreak >= 7 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    🔥 Amazing! You're on a {currentStreak}-day streak of hitting your calorie goals
                  </p>
                </div>
              )}

              {totalDays >= 30 && calorieComplianceRate >= 85 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-sm text-emerald-800">
                    🎯 Excellent consistency! You've been within your calorie range {Math.round(calorieComplianceRate)}% of the time
                  </p>
                </div>
              )}

              {totalDays < 7 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    📈 Keep logging your meals to see more detailed insights and trends
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Macro Distribution */}
          {dailyNutritionData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Macro Distribution</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-blue-600">
                      {Math.round((avgProtein * 4 / avgCalories) * 100)}%
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-800">Protein</div>
                  <div className="text-xs text-gray-600">{Math.round(avgProtein)}g avg</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-green-600">
                      {Math.round((dailyNutritionData.reduce((acc, day) => acc + day.carbs, 0) / totalDays * 4 / avgCalories) * 100)}%
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-800">Carbs</div>
                  <div className="text-xs text-gray-600">
                    {Math.round(dailyNutritionData.reduce((acc, day) => acc + day.carbs, 0) / totalDays)}g avg
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-yellow-600">
                      {Math.round((dailyNutritionData.reduce((acc, day) => acc + day.fat, 0) / totalDays * 9 / avgCalories) * 100)}%
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-800">Fat</div>
                  <div className="text-xs text-gray-600">
                    {Math.round(dailyNutritionData.reduce((acc, day) => acc + day.fat, 0) / totalDays)}g avg
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Daily Detail Modal */}
      {selectedDetailDate && (
        <DailyDetailView
          date={selectedDetailDate}
          onClose={() => setSelectedDetailDate(null)}
        />
      )}
    </div>
  );
}