import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, Save, Calculator, Library, Plus, Camera, Zap, Clock, Star } from 'lucide-react';
import { FoodEntry, PlannedFoodEntry, Food } from '../../types';
import { allMockFoods } from '../../data/mockData';
import QuickAddModal from './QuickAddModal';
import RecipeBuilderModal from './RecipeBuilderModal';

interface AddFoodModalProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  selectedDate: string;
  editingEntry?: FoodEntry | PlannedFoodEntry | null;
  onClose: () => void;
  isPlanned?: boolean;
}

export default function AddFoodModal({ mealType, selectedDate, editingEntry, onClose, isPlanned = false }: AddFoodModalProps) {
  const { state, dispatch } = useApp();
  const { customFoods, foodEntries, recipes } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(editingEntry?.food || null);
  const [amount, setAmount] = useState(editingEntry?.amount.toString() || '100');
  const [showCustomFood, setShowCustomFood] = useState(false);
  const [showLibraryView, setShowLibraryView] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showRecipeBuilder, setShowRecipeBuilder] = useState(false);
  const [showBarcodePlaceholder, setShowBarcodePlaceholder] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    caloriesPer100g: '',
    proteinPer100g: '',
    carbsPer100g: '',
    fatPer100g: ''
  });

  // Combine built-in foods with custom foods
  const allFoods = [...allMockFoods, ...customFoods];
  
  // Convert recipes to food-like objects for selection
  const recipeAsFoods = recipes.map(recipe => ({
    id: `recipe-${recipe.id}`,
    name: `${recipe.name} (Recipe)`,
    caloriesPer100g: recipe.caloriesPerServing,
    proteinPer100g: recipe.proteinPerServing,
    carbsPer100g: recipe.carbsPerServing,
    fatPer100g: recipe.fatPerServing,
    category: 'Recipes',
    isRecipe: true,
    recipe: recipe
  }));
  
  const allFoodsAndRecipes = [...allFoods, ...recipeAsFoods];
  
  // Get recent foods (foods used in last 30 days)
  const recentFoodIds = foodEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    })
    .map(entry => entry.foodId);
  
  const recentFoods = allFoodsAndRecipes
    .filter(food => recentFoodIds.includes(food.id))
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, 5);

  // Filter foods based on search
  const filteredFoods = allFoodsAndRecipes.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get smart suggestions based on time of day
  const getSmartSuggestions = () => {
    const hour = new Date().getHours();
    let suggestions = [];
    
    if (mealType === 'breakfast' || (hour >= 6 && hour < 11)) {
      suggestions = allFoodsAndRecipes.filter(food => 
        food.name.toLowerCase().includes('egg') ||
        food.name.toLowerCase().includes('oat') ||
        food.name.toLowerCase().includes('yogurt') ||
        food.name.toLowerCase().includes('banana')
      );
    } else if (mealType === 'lunch' || (hour >= 11 && hour < 16)) {
      suggestions = allFoodsAndRecipes.filter(food => 
        food.name.toLowerCase().includes('chicken') ||
        food.name.toLowerCase().includes('rice') ||
        food.name.toLowerCase().includes('salad')
      );
    } else if (mealType === 'dinner' || (hour >= 16 && hour < 22)) {
      suggestions = allFoodsAndRecipes.filter(food => 
        food.name.toLowerCase().includes('salmon') ||
        food.name.toLowerCase().includes('beef') ||
        food.name.toLowerCase().includes('pasta')
      );
    } else {
      suggestions = allFoodsAndRecipes.filter(food => 
        food.name.toLowerCase().includes('apple') ||
        food.name.toLowerCase().includes('nuts') ||
        food.name.toLowerCase().includes('yogurt')
      );
    }
    
    return suggestions.slice(0, 3);
  };

  const smartSuggestions = getSmartSuggestions();

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
      alert('Please enter a valid amount greater than 0');
      return;
    }

    const calculatedNutrition = calculateNutrition(selectedFood, amountNum);

    const foodEntry: FoodEntry | PlannedFoodEntry = {
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
      if (isPlanned) {
        dispatch({ type: 'UPDATE_PLANNED_FOOD_ENTRY', payload: foodEntry as PlannedFoodEntry });
      } else {
        dispatch({ type: 'UPDATE_FOOD_ENTRY', payload: foodEntry as FoodEntry });
      }
    } else {
      if (isPlanned) {
        dispatch({ type: 'ADD_PLANNED_FOOD_ENTRY', payload: foodEntry as PlannedFoodEntry });
      } else {
        dispatch({ type: 'ADD_FOOD_ENTRY', payload: foodEntry as FoodEntry });
      }
    }

    // Update food usage tracking
    dispatch({ type: 'UPDATE_FOOD_USAGE', payload: selectedFood.id });

    onClose();
  };

  const handleBarcodeClick = () => {
    setShowBarcodePlaceholder(true);
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
      isCustom: true,
      createdBy: 'user', // In a real app, this would be the actual user ID
      usageCount: 0
    };

    dispatch({ type: 'ADD_CUSTOM_FOOD', payload: newFood });
    setSelectedFood(newFood);
    setShowCustomFood(false);
    setSearchTerm('');
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setShowLibraryView(false);
    setSearchTerm('');
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editingEntry ? (isPlanned ? 'Edit Planned Food' : 'Edit Food') : (isPlanned ? 'Plan Food' : 'Add Food')}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2 capitalize">
            {isPlanned ? 'Planning' : 'Logging'} • {mealType}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!selectedFood ? (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setShowLibraryView(true)}
                  className="bg-orange-50 border border-orange-200 text-orange-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
                >
                  <Library className="w-4 h-4" />
                  Browse Library
                </button>
                <button
                  onClick={() => setShowCustomFood(true)}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Food
                </button>
                <button
                  onClick={() => setShowQuickAdd(true)}
                  className="bg-blue-50 border border-blue-200 text-blue-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Quick Add
                </button>
                <button
                  onClick={handleBarcodeClick}
                  className="bg-purple-50 border border-purple-200 text-purple-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Scan Barcode
                </button>
              </div>
              
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setShowRecipeBuilder(true)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-rose-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Recipe
                </button>
              </div>

              {/* Smart Suggestions */}
              {smartSuggestions.length > 0 && !showLibraryView && !searchTerm && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Suggested for {mealType}
                  </h3>
                  <div className="space-y-2">
                    {smartSuggestions.map(food => (
                      <button
                        key={food.id}
                        onClick={() => handleSelectFood(food)}
                        className="w-full text-left p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">{food.name}</div>
                            <div className="text-sm text-gray-600">
                              {food.category} • {food.caloriesPer100g} cal/100g
                            </div>
                          </div>
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Foods */}
              {recentFoods.length > 0 && !showLibraryView && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    Recent Foods
                  </h3>
                  <div className="space-y-2">
                    {recentFoods.map(food => (
                      <button
                        key={food.id}
                        onClick={() => handleSelectFood(food)}
                        className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">{food.name}</div>
                            <div className="text-sm text-gray-600">
                              {food.category} • {food.caloriesPer100g} cal/100g
                            </div>
                          </div>
                          {food.isCustom && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Custom</span>
                          )}
                          {food.isRecipe && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Recipe</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search */}
              {!showLibraryView && (
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
              )}

              {/* Food List */}
              {!showLibraryView && searchTerm && (
                <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">Select Food</h3>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredFoods.map(food => (
                    <button
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{food.name}</div>
                          <div className="text-sm text-gray-600">
                            {food.category} • {food.caloriesPer100g} cal/100g
                          </div>
                        </div>
                        {food.isCustom && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Custom</span>
                        )}
                        {food.isRecipe && (
                          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Recipe</span>
                        )}
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
              )}

              {/* Library View */}
              {showLibraryView && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800">Food Library</h3>
                    <button
                      onClick={() => setShowLibraryView(false)}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      Back to Search
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Search library..."
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredFoods.map(food => (
                      <button
                        key={food.id}
                        onClick={() => handleSelectFood(food)}
                        className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">{food.name}</div>
                            <div className="text-sm text-gray-600">
                              {food.category} • {food.caloriesPer100g} cal/100g
                            </div>
                          </div>
                          {food.isCustom && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Custom</span>
                          )}
                          {food.isRecipe && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Recipe</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                {editingEntry ? 'Update' : (isPlanned ? 'Plan' : 'Add')} Food
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddModal
          mealType={mealType}
          selectedDate={selectedDate}
          isPlanned={isPlanned}
          onClose={() => {
            setShowQuickAdd(false);
            onClose();
          }}
        />
      )}

      {/* Recipe Builder Modal */}
      {showRecipeBuilder && (
        <RecipeBuilderModal
          onClose={() => setShowRecipeBuilder(false)}
        />
      )}

      {/* Barcode Scanner Placeholder */}
      {showBarcodePlaceholder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Barcode Scanner</h3>
              <p className="text-gray-600 mb-6">
                Barcode scanning is not yet available on this device. Please search or add food manually.
              </p>
              <button
                onClick={() => setShowBarcodePlaceholder(false)}
                className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}