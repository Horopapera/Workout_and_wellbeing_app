import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit3, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { FoodEntry, PlannedFoodEntry } from '../../types';

interface MealSectionProps {
  title: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  entries: FoodEntry[];
  plannedEntries?: PlannedFoodEntry[];
  onAddFood: () => void;
  onEditFood: (entry: FoodEntry) => void;
  onAddPlannedFood?: () => void;
  onEditPlannedFood?: (entry: PlannedFoodEntry) => void;
  showPlanned?: boolean;
}

export default function MealSection({ 
  title, 
  mealType, 
  entries, 
  plannedEntries = [], 
  onAddFood, 
  onEditFood, 
  onAddPlannedFood, 
  onEditPlannedFood,
  showPlanned = false 
}: MealSectionProps) {
  const { dispatch } = useApp();

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Are you sure you want to delete this food entry?')) {
      dispatch({ type: 'DELETE_FOOD_ENTRY', payload: entryId });
    }
  };

  const handleDeletePlannedEntry = (entryId: string) => {
    if (confirm('Are you sure you want to delete this planned food entry?')) {
      dispatch({ type: 'DELETE_PLANNED_FOOD_ENTRY', payload: entryId });
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

  // Calculate planned meal totals
  const plannedMealTotals = plannedEntries.reduce(
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
            {(entries.length > 0 || (showPlanned && plannedEntries.length > 0)) && (
              <p className="text-sm text-gray-600">
                {showPlanned && plannedEntries.length > 0 ? (
                  <>
                    Planned: {Math.round(plannedMealTotals.calories)} cal
                    {entries.length > 0 && (
                      <> • Logged: {Math.round(mealTotals.calories)} cal</>
                    )}
                  </>
                ) : (
                  <>{Math.round(mealTotals.calories)} cal • {Math.round(mealTotals.protein)}g protein</>
                )}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showPlanned && onAddPlannedFood && (
            <button
              onClick={onAddPlannedFood}
              className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
              title="Add planned food"
            >
              <Calendar className="w-5 h-5 text-blue-600" />
            </button>
          )}
          <button
            onClick={onAddFood}
            className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center hover:bg-orange-100 transition-colors"
            title="Log food"
          >
            <Plus className="w-5 h-5 text-orange-600" />
          </button>
        </div>
      </div>

      {/* Planned Foods */}
      {showPlanned && plannedEntries.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Planned
          </h4>
          <div className="space-y-2">
            {plannedEntries.map(entry => (
              <div key={entry.id} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-blue-800">{entry.food.name}</h4>
                      <div className="flex items-center gap-2">
                        {onEditPlannedFood && (
                          <button
                            onClick={() => onEditPlannedFood(entry)}
                            className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center hover:bg-blue-200 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-blue-600" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePlannedEntry(entry.id)}
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
        </div>
      )}

      {/* Logged Foods */}
      {entries.length === 0 && (!showPlanned || plannedEntries.length === 0) ? (
        <div className="text-center py-6 text-gray-500">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm">No foods logged yet</p>
          <p className="text-xs text-gray-400">Tap + to add food</p>
        </div>
      ) : (
        <>
          {entries.length > 0 && (
            <div>
              {showPlanned && (
                <h4 className="text-sm font-medium text-emerald-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Logged
                </h4>
              )}
              <div className="space-y-3">
                {entries.map(entry => (
                  <div key={entry.id} className={`rounded-lg p-3 ${showPlanned ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium ${showPlanned ? 'text-emerald-800' : 'text-gray-800'}`}>{entry.food.name}</h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEditFood(entry)}
                              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                                showPlanned 
                                  ? 'bg-emerald-100 hover:bg-emerald-200' 
                                  : 'bg-blue-50 hover:bg-blue-100'
                              }`}
                            >
                              <Edit3 className={`w-3 h-3 ${showPlanned ? 'text-emerald-600' : 'text-blue-600'}`} />
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="w-6 h-6 bg-red-50 rounded flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                        
                        <div className={`text-sm mb-2 ${showPlanned ? 'text-emerald-700' : 'text-gray-600'}`}>
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
              </div>
            </div>
          )}
          
          {/* Meal Summary */}
          {(entries.length > 1 || (showPlanned && plannedEntries.length > 0 && entries.length > 0)) && (
            <div className="border-t pt-3 mt-3">
              {showPlanned && plannedEntries.length > 0 && entries.length > 0 ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-700">Planned Total:</span>
                    <span className="font-semibold text-blue-800">
                      {Math.round(plannedMealTotals.calories)} cal • {Math.round(plannedMealTotals.protein)}g protein
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Logged Total:</span>
                    <span className="font-semibold text-emerald-800">
                      {Math.round(mealTotals.calories)} cal • {Math.round(mealTotals.protein)}g protein
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Meal Total:</span>
                  <span className="font-semibold text-gray-800">
                    {Math.round(mealTotals.calories)} cal • {Math.round(mealTotals.protein)}g protein
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}