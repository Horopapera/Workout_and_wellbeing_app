import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Plus, Settings, CalendarDays } from 'lucide-react';
import DietHeader from './DietHeader';
import DailyNutritionSummary from './DailyNutritionSummary';
import MealSection from './MealSection';
import AddFoodModal from './AddFoodModal';
import DateSelector from './DateSelector';
import FoodLibrary from './FoodLibrary';
import MacroGoalsSettings from './MacroGoalsSettings';
import MealPlanner from './MealPlanner';
import DietHistory from './DietHistory';
import QuickAddModal from './QuickAddModal';
import { FoodEntry, PlannedFoodEntry } from '../../types';

export default function DietTracker() {
  const { state } = useApp();
  const { user, foodEntries, plannedFoodEntries, currentDate } = state;
  const [activeTab, setActiveTab] = useState<'today' | 'planner' | 'history'>('today');
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showFoodLibrary, setShowFoodLibrary] = useState(false);
  const [showMacroGoals, setShowMacroGoals] = useState(false);
  const [showAddPlannedFood, setShowAddPlannedFood] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedPlannedMeal, setSelectedPlannedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [editingPlannedEntry, setEditingPlannedEntry] = useState<PlannedFoodEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  if (!user) return null;

  // Get today's food entries
  const todayEntries = foodEntries.filter(entry => entry.date === selectedDate);
  const todayPlannedEntries = plannedFoodEntries.filter(entry => entry.date === selectedDate);

  // Calculate daily nutrition totals
  const dailyNutrition = todayEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate planned nutrition totals
  const plannedNutrition = todayPlannedEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Group entries by meal type
  const mealEntries = {
    breakfast: todayEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: todayEntries.filter(entry => entry.mealType === 'lunch'),
    dinner: todayEntries.filter(entry => entry.mealType === 'dinner'),
    snack: todayEntries.filter(entry => entry.mealType === 'snack')
  };

  // Group planned entries by meal type
  const plannedMealEntries = {
    breakfast: todayPlannedEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: todayPlannedEntries.filter(entry => entry.mealType === 'lunch'),
    dinner: todayPlannedEntries.filter(entry => entry.mealType === 'dinner'),
    snack: todayPlannedEntries.filter(entry => entry.mealType === 'snack')
  };

  const handleAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMeal(mealType);
    setEditingEntry(null);
    setShowAddFood(true);
  };

  const handleAddPlannedFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedPlannedMeal(mealType);
    setEditingPlannedEntry(null);
    setShowAddPlannedFood(true);
  };

  const handleEditFood = (entry: FoodEntry) => {
    setSelectedMeal(entry.mealType);
    setEditingEntry(entry);
    setShowAddFood(true);
  };

  const handleEditPlannedFood = (entry: PlannedFoodEntry) => {
    setSelectedPlannedMeal(entry.mealType);
    setEditingPlannedEntry(entry);
    setShowAddPlannedFood(true);
  };

  const handleCloseAddFood = () => {
    setShowAddFood(false);
    setEditingEntry(null);
  };

  const handleClosePlannedAddFood = () => {
    setShowAddPlannedFood(false);
    setEditingPlannedEntry(null);
  };

  const isToday = selectedDate === currentDate;
  const selectedDateObj = new Date(selectedDate);
  const today = new Date();
  const isPastDate = selectedDateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      <DietHeader 
        selectedDate={selectedDate}
        onDateClick={() => setShowDateSelector(true)}
        isToday={isToday}
        isPastDate={isPastDate}
        onShowFoodLibrary={() => setShowFoodLibrary(true)}
        onShowMacroGoals={() => setShowMacroGoals(true)}
        onShowQuickAdd={() => setShowQuickAdd(true)}
      />
      
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 border-b-2 transition-colors ${
              activeTab === 'today'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{isToday ? 'Today' : 'Daily Log'}</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 border-b-2 transition-colors ${
              activeTab === 'planner'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm font-medium">Meal Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">History</span>
          </button>
        </div>
      </div>
      
      <div className="px-4 space-y-6">
        {activeTab === 'today' ? (
          <>
            <DailyNutritionSummary 
              nutrition={dailyNutrition}
              plannedNutrition={plannedNutrition}
              targets={user}
              selectedDate={selectedDate}
              showComparison={isToday}
            />
            
            <div className="space-y-4">
              <MealSection
                title="Breakfast"
                mealType="breakfast"
                entries={mealEntries.breakfast}
                plannedEntries={plannedMealEntries.breakfast}
                onAddFood={() => handleAddFood('breakfast')}
                onEditFood={handleEditFood}
                onAddPlannedFood={() => handleAddPlannedFood('breakfast')}
                onEditPlannedFood={handleEditPlannedFood}
                showPlanned={isToday}
              />
              
              <MealSection
                title="Lunch"
                mealType="lunch"
                entries={mealEntries.lunch}
                plannedEntries={plannedMealEntries.lunch}
                onAddFood={() => handleAddFood('lunch')}
                onEditFood={handleEditFood}
                onAddPlannedFood={() => handleAddPlannedFood('lunch')}
                onEditPlannedFood={handleEditPlannedFood}
                showPlanned={isToday}
              />
              
              <MealSection
                title="Dinner"
                mealType="dinner"
                entries={mealEntries.dinner}
                plannedEntries={plannedMealEntries.dinner}
                onAddFood={() => handleAddFood('dinner')}
                onEditFood={handleEditFood}
                onAddPlannedFood={() => handleAddPlannedFood('dinner')}
                onEditPlannedFood={handleEditPlannedFood}
                showPlanned={isToday}
              />
              
              <MealSection
                title="Snacks"
                mealType="snack"
                entries={mealEntries.snack}
                plannedEntries={plannedMealEntries.snack}
                onAddFood={() => handleAddFood('snack')}
                onEditFood={handleEditFood}
                onAddPlannedFood={() => handleAddPlannedFood('snack')}
                onEditPlannedFood={handleEditPlannedFood}
                showPlanned={isToday}
              />
            </div>
          </>
        ) : (
          activeTab === 'planner' ? (
            <MealPlanner />
          ) : (
            <DietHistory />
          )
        )}
      </div>

      {/* Add/Edit Food Modal */}
      {showAddFood && (
        <AddFoodModal
          mealType={selectedMeal}
          selectedDate={selectedDate}
          editingEntry={editingEntry}
          onClose={handleCloseAddFood}
        />
      )}

      {/* Add/Edit Planned Food Modal */}
      {showAddPlannedFood && (
        <AddFoodModal
          mealType={selectedPlannedMeal}
          selectedDate={selectedDate}
          editingEntry={editingPlannedEntry}
          onClose={handleClosePlannedAddFood}
          isPlanned={true}
        />
      )}

      {/* Food Library Modal */}
      {showFoodLibrary && (
        <FoodLibrary
          onClose={() => setShowFoodLibrary(false)}
        />
      )}

      {/* Macro Goals Settings Modal */}
      {showMacroGoals && (
        <MacroGoalsSettings
          onClose={() => setShowMacroGoals(false)}
        />
      )}
      
      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddModal
          mealType="breakfast"
          selectedDate={selectedDate}
          isPlanned={false}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
      
      {/* Date Selector Modal */}
      {showDateSelector && (
        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setShowDateSelector(false);
          }}
          onClose={() => setShowDateSelector(false)}
        />
      )}
    </div>
  );
}