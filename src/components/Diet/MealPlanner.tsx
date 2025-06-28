import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, ChevronLeft, ChevronRight, Plus, Copy, Save, Trash2, BookOpen, Clock } from 'lucide-react';
import { PlannedFoodEntry, MealTemplate } from '../../types';
import AddFoodModal from './AddFoodModal';
import MealTemplateManager from './MealTemplateManager';

export default function MealPlanner() {
  const { state, dispatch } = useApp();
  const { plannedFoodEntries, mealTemplates, currentDate } = state;
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [editingEntry, setEditingEntry] = useState<PlannedFoodEntry | null>(null);
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  // Get planned entries for selected date
  const dayPlannedEntries = plannedFoodEntries.filter(entry => entry.date === selectedDate);

  // Group by meal type
  const plannedMealEntries = {
    breakfast: dayPlannedEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: dayPlannedEntries.filter(entry => entry.mealType === 'lunch'),
    dinner: dayPlannedEntries.filter(entry => entry.mealType === 'dinner'),
    snack: dayPlannedEntries.filter(entry => entry.mealType === 'snack')
  };

  // Calculate daily totals
  const dailyTotals = dayPlannedEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMeal(mealType);
    setEditingEntry(null);
    setShowAddFood(true);
  };

  const handleEditFood = (entry: PlannedFoodEntry) => {
    setSelectedMeal(entry.mealType);
    setEditingEntry(entry);
    setShowAddFood(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Are you sure you want to delete this planned food entry?')) {
      dispatch({ type: 'DELETE_PLANNED_FOOD_ENTRY', payload: entryId });
    }
  };

  const handleCopyFromDate = (fromDate: string) => {
    if (fromDate === selectedDate) {
      alert('Cannot copy meals to the same date');
      return;
    }

    const fromEntries = plannedFoodEntries.filter(entry => entry.date === fromDate);
    if (fromEntries.length === 0) {
      alert('No planned meals found for the selected date');
      return;
    }

    if (dayPlannedEntries.length > 0) {
      if (!confirm('This will replace all existing planned meals for this date. Continue?')) {
        return;
      }
    }

    dispatch({ type: 'COPY_PLANNED_MEALS', payload: { fromDate, toDate: selectedDate } });
  };

  const handleSaveAsTemplate = () => {
    if (dayPlannedEntries.length === 0) {
      alert('No planned meals to save as template');
      return;
    }

    const templateName = prompt('Enter a name for this meal template:');
    if (!templateName) return;

    const template: MealTemplate = {
      id: Date.now().toString(),
      name: templateName,
      meals: plannedMealEntries,
      totalCalories: dailyTotals.calories,
      totalProtein: dailyTotals.protein,
      totalCarbs: dailyTotals.carbs,
      totalFat: dailyTotals.fat,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_MEAL_TEMPLATE', payload: template });
    alert('Meal template saved successfully!');
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
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

  const meals = [
    { id: 'breakfast', name: 'Breakfast', entries: plannedMealEntries.breakfast },
    { id: 'lunch', name: 'Lunch', entries: plannedMealEntries.lunch },
    { id: 'dinner', name: 'Dinner', entries: plannedMealEntries.dinner },
    { id: 'snack', name: 'Snacks', entries: plannedMealEntries.snack }
  ];

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateDate('prev')}
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">{formatDate(selectedDate)}</h2>
            <p className="text-sm text-gray-600">{selectedDate}</p>
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Daily Summary */}
        {dayPlannedEntries.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Daily Plan Summary</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{Math.round(dailyTotals.calories)}</div>
                <div className="text-xs text-blue-700">Calories</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{Math.round(dailyTotals.protein)}g</div>
                <div className="text-xs text-blue-700">Protein</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{Math.round(dailyTotals.carbs)}g</div>
                <div className="text-xs text-blue-700">Carbs</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{Math.round(dailyTotals.fat)}g</div>
                <div className="text-xs text-blue-700">Fat</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowTemplateManager(true)}
            className="flex-1 bg-emerald-50 border border-emerald-200 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Templates
          </button>
          <button
            onClick={() => {
              const fromDate = prompt('Copy meals from date (YYYY-MM-DD):');
              if (fromDate) handleCopyFromDate(fromDate);
            }}
            className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy From
          </button>
          {dayPlannedEntries.length > 0 && (
            <button
              onClick={handleSaveAsTemplate}
              className="flex-1 bg-orange-50 border border-orange-200 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Template
            </button>
          )}
        </div>
      </div>

      {/* Meal Planning */}
      <div className="space-y-4">
        {meals.map(meal => (
          <div key={meal.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getMealIcon(meal.id)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{meal.name}</h3>
                  {meal.entries.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {Math.round(meal.entries.reduce((acc, entry) => acc + entry.calories, 0))} cal • 
                      {Math.round(meal.entries.reduce((acc, entry) => acc + entry.protein, 0))}g protein
                    </p>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleAddFood(meal.id as any)}
                className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            {meal.entries.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm">No foods planned</p>
                <p className="text-xs text-gray-400">Tap + to plan food</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meal.entries.map(entry => (
                  <div key={entry.id} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-blue-800">{entry.food.name}</h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditFood(entry)}
                              className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center hover:bg-blue-200 transition-colors"
                            >
                              <Clock className="w-3 h-3 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="w-6 h-6 bg-red-100 rounded flex items-center justify-center hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-blue-700 mb-2">
                          {entry.amount}g • {Math.round(entry.calories)} cal
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white rounded px-2 py-1 text-center">
                            <div className="font-medium text-blue-600">{Math.round(entry.protein)}g</div>
                            <div className="text-blue-500">Protein</div>
                          </div>
                          <div className="bg-white rounded px-2 py-1 text-center">
                            <div className="font-medium text-green-600">{Math.round(entry.carbs)}g</div>
                            <div className="text-green-500">Carbs</div>
                          </div>
                          <div className="bg-white rounded px-2 py-1 text-center">
                            <div className="font-medium text-yellow-600">{Math.round(entry.fat)}g</div>
                            <div className="text-yellow-500">Fat</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <AddFoodModal
          mealType={selectedMeal}
          selectedDate={selectedDate}
          editingEntry={editingEntry}
          onClose={() => {
            setShowAddFood(false);
            setEditingEntry(null);
          }}
          isPlanned={true}
        />
      )}

      {/* Template Manager Modal */}
      {showTemplateManager && (
        <MealTemplateManager
          selectedDate={selectedDate}
          onClose={() => setShowTemplateManager(false)}
        />
      )}
    </div>
  );
}