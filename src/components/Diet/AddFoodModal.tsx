import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, Save, Calculator } from 'lucide-react';
import { FoodEntry, Food } from '../../types';
import { mockFoods } from '../../data/mockData';

interface AddFoodModalProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  selectedDate: string;
  editingEntry?: FoodEntry | null;
  onClose: () => void;
}

export default function AddFoodModal({ mealType, selectedDate, editingEntry, onClose }: AddFoodModalProps) {
  const { dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(editingEntry?.food || null);
  const [amount, setAmount] = useState(editingEntry?.amount.toString() || '100');
  const [showCustomFood, setShowCustomFood] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    caloriesPer100g: '',
    proteinPer100g: '',
    carbsPer100g: '',
    fatPer100g: ''
  });

  // Filter foods based on search
  const filteredFoods = mockFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate nutrition based on amount
  const calculateNutrition = (food: Food, grams: number) => {
    const multiplier = grams / 100;
    return {
      calories: food.caloriesPer100g * multiplier,
      protein: food.proteinPer100g * multiplier,
      carbs: food.carbsPer100g * multiplier,
      fat: food.fatPer100g * multiplier
    };
  };

  const nutrition = selectedFood ? calculateNutrition(selectedFood, Number(amount) || 0) : null;

  const handleSave = () => {
    if (!selectedFood || !amount) {
      alert('Please select a food and enter an amount');
      return;
    }

    const amountNum = Number(amount);
    if (amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const calculatedNutrition = calculateNutrition(selectedFood, amountNum);

    const foodEntry: FoodEntry = {
      id: editingEntry?.id || Date.now().toString(),
      foodId: selectedFood.id,
      food: selectedFood,
      amount: amountNum,
      calories: calculatedNutrition.calories,
      protein: calculatedNutrition.protein,
      carbs: calculatedNutrition.carbs,
      fat: calculatedNutrition.fat,
      mealType,
      date: selectedDate,
      createdAt: editingEntry?.createdAt || new Date().toISOString()
    };

    if (editingEntry) {
      dispatch({ type: 'UPDATE_FOOD_ENTRY', payload: foodEntry });
    } else {
      dispatch({ type: 'ADD_FOOD_ENTRY', payload: foodEntry });
    }

    onClose();
  };

  const handleCreateCustomFood = () => {
    if (!customFood.name || !customFood.caloriesPer100g) {
      alert('Please enter at least a name and calories per 100g');
      return;
    }

    const newFood: Food = {
      id: `custom-${Date.now()}`,
      name: customFood.name,
      caloriesPer100g: Number(customFood.caloriesPer100g),
      proteinPer100g: Number(customFood.proteinPer100g) || 0,
      carbsPer100g: Number(customFood.carbsPer100g) || 0,
      fatPer100g: Number(customFood.fatPer100g) || 0,
      category: 'Custom',
      isCustom: true
    };

    setSelectedFood(newFood);
    setShowCustomFood(false);
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editingEntry ? 'Edit Food' : 'Add Food'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2 capitalize">{mealType}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!selectedFood ? (
            <>
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Foods
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-10"
                    placeholder="Search for foods..."
                  />
                  <Search className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Food List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">Select Food</h3>
                  <button
                    onClick={() => setShowCustomFood(true)}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    + Add Custom
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredFoods.map(food => (
                    <button
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{food.name}</div>
                      <div className="text-sm text-gray-600">
                        {food.category} • {food.caloriesPer100g} cal/100g
                      </div>
                    </button>
                  ))}
                  
                  {filteredFoods.length === 0 && searchTerm && (
                    <div className="text-center py-6 text-gray-500">
                      <p>No foods found</p>
                      <button
                        onClick={() => setShowCustomFood(true)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
                      >
                        Create custom food
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Food Form */}
              {showCustomFood && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-800 mb-3">Create Custom Food</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={customFood.name}
                      onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Food name"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={customFood.caloriesPer100g}
                        onChange={(e) => setCustomFood({ ...customFood, caloriesPer100g: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Calories/100g"
                      />
                      <input
                        type="number"
                        value={customFood.proteinPer100g}
                        onChange={(e) => setCustomFood({ ...customFood, proteinPer100g: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Protein/100g"
                      />
                      <input
                        type="number"
                        value={customFood.carbsPer100g}
                        onChange={(e) => setCustomFood({ ...customFood, carbsPer100g: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Carbs/100g"
                      />
                      <input
                        type="number"
                        value={customFood.fatPer100g}
                        onChange={(e) => setCustomFood({ ...customFood, fatPer100g: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Fat/100g"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCustomFood(false)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateCustomFood}
                        className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Selected Food */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">Selected Food</h3>
                  <button
                    onClick={() => setSelectedFood(null)}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="font-medium text-gray-800">{selectedFood.name}</div>
                  <div className="text-sm text-gray-600">
                    {selectedFood.category} • {selectedFood.caloriesPer100g} cal/100g
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (grams)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="100"
                  min="1"
                />
              </div>

              {/* Nutrition Preview */}
              {nutrition && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-4 h-4 text-gray-600" />
                    <h3 className="font-medium text-gray-800">Nutrition Preview</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-orange-600">{Math.round(nutrition.calories)}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-600">{Math.round(nutrition.protein)}g</div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-600">{Math.round(nutrition.carbs)}g</div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-yellow-600">{Math.round(nutrition.fat)}g</div>
                      <div className="text-xs text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            {selectedFood && (
              <button
                onClick={handleSave}
                disabled={!amount || Number(amount) <= 0}
                className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  !amount || Number(amount) <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
              >
                <Save className="w-4 h-4" />
                {editingEntry ? 'Update' : 'Add'} Food
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}