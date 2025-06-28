import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, Plus, Edit3, Trash2, Library, ChefHat, Camera } from 'lucide-react';
import { Food } from '../../types';
import { mockFoods } from '../../data/mockData';
import RecipeBuilderModal from './RecipeBuilderModal';

interface FoodLibraryProps {
  onClose: () => void;
}

export default function FoodLibrary({ onClose }: FoodLibraryProps) {
  const { state, dispatch } = useApp();
  const { customFoods, recipes } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<any>(null);
  const [showRecipeBuilder, setShowRecipeBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'recipes' | 'recent'>('all');
  const [newFood, setNewFood] = useState({
    name: '',
    category: '',
    caloriesPer100g: '',
    proteinPer100g: '',
    carbsPer100g: '',
    fatPer100g: ''
  });

  // Combine all foods
  const allFoods = [...mockFoods, ...customFoods];

  // Convert recipes to food-like objects for display
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

  // Filter foods based on active tab and search
  const getFilteredFoods = () => {
    let foods: any[] = allFoods;

    // Filter by tab
    switch (activeTab) {
      case 'custom':
        foods = customFoods;
        break;
      case 'recipes':
        foods = recipeAsFoods;
        break;
      case 'recent':
        foods = [...allFoods, ...recipeAsFoods]
          .filter(food => food.lastUsed)
          .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
          .slice(0, 20);
        break;
      default:
        foods = [...allFoods, ...recipeAsFoods];
    }

    // Filter by search term
    if (searchTerm) {
      foods = foods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return foods;
  };

  const filteredFoods = getFilteredFoods();

  const handleSaveFood = () => {
    if (!newFood.name || !newFood.caloriesPer100g) {
      alert('Please enter at least a name and calories per 100g');
      return;
    }

    const foodData: Food = {
      id: editingFood?.id || `custom-${Date.now()}`,
      name: newFood.name,
      category: newFood.category || 'Custom',
      caloriesPer100g: Number(newFood.caloriesPer100g),
      proteinPer100g: Number(newFood.proteinPer100g) || 0,
      carbsPer100g: Number(newFood.carbsPer100g) || 0,
      fatPer100g: Number(newFood.fatPer100g) || 0,
      isCustom: true,
      createdBy: 'user',
      usageCount: editingFood?.usageCount || 0,
      lastUsed: editingFood?.lastUsed
    };

    if (editingFood) {
      dispatch({ type: 'UPDATE_CUSTOM_FOOD', payload: foodData });
    } else {
      dispatch({ type: 'ADD_CUSTOM_FOOD', payload: foodData });
    }

    // Reset form
    setNewFood({
      name: '',
      category: '',
      caloriesPer100g: '',
      proteinPer100g: '',
      carbsPer100g: '',
      fatPer100g: ''
    });
    setShowAddFood(false);
    setEditingFood(null);
  };

  const handleEditFood = (food: Food) => {
    if (!food.isCustom) {
      alert('You can only edit custom foods');
      return;
    }

    setEditingFood(food);
    setNewFood({
      name: food.name,
      category: food.category,
      caloriesPer100g: food.caloriesPer100g.toString(),
      proteinPer100g: food.proteinPer100g.toString(),
      carbsPer100g: food.carbsPer100g.toString(),
      fatPer100g: food.fatPer100g.toString()
    });
    setShowAddFood(true);
  };

  const handleDeleteFood = (food: Food) => {
    if (!food.isCustom) {
      alert('You can only delete custom foods');
      return;
    }

    if (confirm(`Are you sure you want to delete "${food.name}"?`)) {
      dispatch({ type: 'DELETE_CUSTOM_FOOD', payload: food.id });
    }
  };

  const handleEditRecipe = (recipe: any) => {
    setEditingRecipe(recipe);
    setShowRecipeBuilder(true);
  };

  const handleDeleteRecipe = (recipe: any) => {
    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      dispatch({ type: 'DELETE_RECIPE', payload: recipe.id });
    }
  };

  const handleCancelEdit = () => {
    setShowAddFood(false);
    setEditingFood(null);
    setNewFood({
      name: '',
      category: '',
      caloriesPer100g: '',
      proteinPer100g: '',
      carbsPer100g: '',
      fatPer100g: ''
    });
  };

  const tabs = [
    { id: 'all', label: 'All Foods', count: allFoods.length },
    { id: 'custom', label: 'Custom', count: customFoods.length },
    { id: 'recipes', label: 'Recipes', count: recipes.length },
    { id: 'recent', label: 'Recent', count: allFoods.filter(f => f.lastUsed).length }
  ];

  return (
    <>
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6" />
              <h2 className="text-xl font-bold">Food Library</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">Manage your food database</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!showAddFood ? (
            <>
              {/* Search and Add Button */}
              <div className="space-y-3 mb-4">
                <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-10"
                    placeholder="Search foods..."
                  />
                  <Search className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
                <button
                  onClick={() => setShowAddFood(true)}
                  className="bg-orange-500 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRecipeBuilder(true)}
                    className="flex-1 bg-pink-500 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors"
                  >
                    <ChefHat className="w-4 h-4" />
                    Create Recipe
                  </button>
                  <button
                    onClick={() => alert('Barcode scanning is not yet available on this device. Please search or add food manually.')}
                    className="flex-1 bg-purple-500 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Scan Barcode
                  </button>
                </div>
              </div>

              {/* Food List */}
              <div className="space-y-3">
                {filteredFoods.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Library className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium">No foods found</p>
                    <p className="text-sm">
                      {searchTerm ? 'Try a different search term' : 'Add your first custom food to get started'}
                    </p>
                  </div>
                ) : (
                  filteredFoods.map(food => (
                    <div key={food.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{food.name}</h3>
                            {food.isCustom && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Custom</span>
                            )}
                            {food.isRecipe && (
                              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Recipe</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{food.category}</p>
                          
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="bg-white rounded px-2 py-1 text-center">
                              <div className="font-medium text-orange-600">{food.caloriesPer100g}</div>
                              <div className="text-gray-500">Cal</div>
                            </div>
                            <div className="bg-white rounded px-2 py-1 text-center">
                              <div className="font-medium text-blue-600">{food.proteinPer100g}g</div>
                              <div className="text-gray-500">Protein</div>
                            </div>
                            <div className="bg-white rounded px-2 py-1 text-center">
                              <div className="font-medium text-green-600">{food.carbsPer100g}g</div>
                              <div className="text-gray-500">Carbs</div>
                            </div>
                            <div className="bg-white rounded px-2 py-1 text-center">
                              <div className="font-medium text-yellow-600">{food.fatPer100g}g</div>
                              <div className="text-gray-500">Fat</div>
                            </div>
                          </div>

                          {food.usageCount && food.usageCount > 0 && (
                            <p className="text-xs text-gray-500 mt-2">Used {food.usageCount} times</p>
                          )}
                          
                          {food.isRecipe && food.recipe && (
                            <p className="text-xs text-gray-500 mt-2">
                              {food.recipe.ingredients.length} ingredients • Makes {food.recipe.servings} servings
                            </p>
                          )}
                        </div>

                        {(food.isCustom || food.isRecipe) && (
                          <div className="flex items-center gap-2 ml-3">
                            <button
                              onClick={() => food.isRecipe ? handleEditRecipe(food.recipe) : handleEditFood(food)}
                              className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => food.isRecipe ? handleDeleteRecipe(food.recipe) : handleDeleteFood(food)}
                              className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Add/Edit Food Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingFood ? 'Edit Food' : 'Add New Food'}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
                  <input
                    type="text"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Grilled Chicken Breast"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={newFood.category}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Protein, Vegetables, Grains"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calories per 100g</label>
                    <input
                      type="number"
                      value={newFood.caloriesPer100g}
                      onChange={(e) => setNewFood({ ...newFood, caloriesPer100g: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="165"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                    <input
                      type="number"
                      value={newFood.proteinPer100g}
                      onChange={(e) => setNewFood({ ...newFood, proteinPer100g: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="31"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                    <input
                      type="number"
                      value={newFood.carbsPer100g}
                      onChange={(e) => setNewFood({ ...newFood, carbsPer100g: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                    <input
                      type="number"
                      value={newFood.fatPer100g}
                      onChange={(e) => setNewFood({ ...newFood, fatPer100g: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="3.6"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveFood}
                  disabled={!newFood.name || !newFood.caloriesPer100g}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    !newFood.name || !newFood.caloriesPer100g
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  {editingFood ? 'Update Food' : 'Add Food'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showAddFood && (
          <div className="border-t border-gray-200 p-4 bg-white">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>

      {/* Recipe Builder Modal */}
      {showRecipeBuilder && (
        <RecipeBuilderModal
          recipe={editingRecipe}
          onClose={() => {
            setShowRecipeBuilder(false);
            setEditingRecipe(null);
          }}
        />
      )}
    </>
  );
}