import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { FoodEntry } from '../../types';

interface MealSectionProps {
  title: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  entries: FoodEntry[];
  onAddFood: () => void;
  onEditFood: (entry: FoodEntry) => void;
}

export default function MealSection({ title, mealType, entries, onAddFood, onEditFood }: MealSectionProps) {
  const { dispatch } = useApp();

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Are you sure you want to delete this food entry?')) {
      dispatch({ type: 'DELETE_FOOD_ENTRY', payload: entryId });
    }
  };

  // Calculate meal totals
  const mealTotals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getMealIcon = () => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getMealIcon()}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {entries.length > 0 && (
              <p className="text-sm text-gray-600">
                {Math.round(mealTotals.calories)} cal • {Math.round(mealTotals.protein)}g protein
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={onAddFood}
          className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center hover:bg-orange-100 transition-colors"
        >
          <Plus className="w-5 h-5 text-orange-600" />
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm">No foods logged yet</p>
          <p className="text-xs text-gray-400">Tap + to add food</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{entry.food.name}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditFood(entry)}
                        className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center hover:bg-blue-100 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="w-6 h-6 bg-red-50 rounded flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {entry.amount}g • {Math.round(entry.calories)} cal
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white rounded px-2 py-1 text-center">
                      <div className="font-medium text-blue-600">{Math.round(entry.protein)}g</div>
                      <div className="text-gray-500">Protein</div>
                    </div>
                    <div className="bg-white rounded px-2 py-1 text-center">
                      <div className="font-medium text-green-600">{Math.round(entry.carbs)}g</div>
                      <div className="text-gray-500">Carbs</div>
                    </div>
                    <div className="bg-white rounded px-2 py-1 text-center">
                      <div className="font-medium text-yellow-600">{Math.round(entry.fat)}g</div>
                      <div className="text-gray-500">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Meal Summary */}
          {entries.length > 1 && (
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">Meal Total:</span>
                <span className="font-semibold text-gray-800">
                  {Math.round(mealTotals.calories)} cal • {Math.round(mealTotals.protein)}g protein
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}