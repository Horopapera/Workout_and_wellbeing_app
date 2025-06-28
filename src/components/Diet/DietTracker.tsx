import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Plus } from 'lucide-react';
import DietHeader from './DietHeader';
import DailyNutritionSummary from './DailyNutritionSummary';
import MealSection from './MealSection';
import AddFoodModal from './AddFoodModal';
import DateSelector from './DateSelector';
import { FoodEntry } from '../../types';

export default function DietTracker() {
  const { state } = useApp();
  const { user, foodEntries, currentDate } = state;
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  if (!user) return null;

  // Get today's food entries
  const todayEntries = foodEntries.filter(entry => entry.date === selectedDate);

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

  // Group entries by meal type
  const mealEntries = {
    breakfast: todayEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: todayEntries.filter(entry => entry.mealType === 'lunch'),
    dinner: todayEntries.filter(entry => entry.mealType === 'dinner'),
    snack: todayEntries.filter(entry => entry.mealType === 'snack')
  };

  const handleAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMeal(mealType);
    setEditingEntry(null);
    setShowAddFood(true);
  };

  const handleEditFood = (entry: FoodEntry) => {
    setSelectedMeal(entry.mealType);
    setEditingEntry(entry);
    setShowAddFood(true);
  };

  const handleCloseAddFood = () => {
    setShowAddFood(false);
    setEditingEntry(null);
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
      />
      
      <div className="px-4 space-y-6">
        <DailyNutritionSummary 
          nutrition={dailyNutrition}
          targets={user}
          selectedDate={selectedDate}
        />
        
        <div className="space-y-4">
          <MealSection
            title="Breakfast"
            mealType="breakfast"
            entries={mealEntries.breakfast}
            onAddFood={() => handleAddFood('breakfast')}
            onEditFood={handleEditFood}
          />
          
          <MealSection
            title="Lunch"
            mealType="lunch"
            entries={mealEntries.lunch}
            onAddFood={() => handleAddFood('lunch')}
            onEditFood={handleEditFood}
          />
          
          <MealSection
            title="Dinner"
            mealType="dinner"
            entries={mealEntries.dinner}
            onAddFood={() => handleAddFood('dinner')}
            onEditFood={handleEditFood}
          />
          
          <MealSection
            title="Snacks"
            mealType="snack"
            entries={mealEntries.snack}
            onAddFood={() => handleAddFood('snack')}
            onEditFood={handleEditFood}
          />
        </div>
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