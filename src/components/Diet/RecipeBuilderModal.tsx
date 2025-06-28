import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Save, Search, Calculator, ChefHat } from 'lucide-react';
import { Recipe, Food } from '../../types';
import { allMockFoods } from '../../data/mockData';

interface RecipeBuilderModalProps {
  recipe?: Recipe | null;
  onClose: () => void;
}

export default function RecipeBuilderModal({ recipe, onClose }: RecipeBuilderModalProps) {
  const { state, dispatch } = useApp();
  const { customFoods } = state;
  
  const [recipeName, setRecipeName] = useState(recipe?.name || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [servings, setServings] = useState(recipe?.servings.toString() || '4');
  const [instructions, setInstructions] = useState(recipe?.instructions || '');
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients || []
  );
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Combine all available foods
  const allFoods = [...allMockFoods, ...customFoods];
  const filteredFoods = allFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate recipe totals
  const calculateTotals = () => {
    const totals = ingredients.reduce(
      (acc, ingredient) => {
        const multiplier = ingredient.amount / 100;
        return {
          calories: acc.calories + (ingredient.food.caloriesPer100g * multiplier),
          protein: acc.protein + (ingredient.food.proteinPer100g * multiplier),
          carbs: acc.carbs + (ingredient.food.carbsPer100g * multiplier),
          fat: acc.fat + (ingredient.food.fatPer100g * multiplier)
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const servingCount = Number(servings) || 1;
    return {
      total: totals,
      perServing: {
        calories: totals.calories / servingCount,
        protein: totals.protein / servingCount,
        carbs: totals.carbs / servingCount,
        fat: totals.fat / servingCount
      }
    };
  };

  const { total, perServing } = calculateTotals();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!recipeName.trim()) {
      newErrors.name = 'Recipe name is required';
    }

    if (!servings || Number(servings) <= 0) {
      newErrors.servings = 'Servings must be greater than 0';
    }

    if (ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddIngredient = (food: Food) => {
    const newIngredient = {
      foodId: food.id,
      food: food,
      amount: 100 // Default 100g
    };

    setIngredients([...ingredients, newIngredient]);
    setShowAddIngredient(false);
    setSearchTerm('');
  };

  const handleUpdateIngredientAmount = (index: number, amount: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].amount = amount;
    setIngredients(updatedIngredients);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const recipeData: Recipe = {
      id: recipe?.id || Date.now().toString(),
      name: recipeName.trim(),
      description: description.trim() || undefined,
      ingredients,
      servings: Number(servings),
      instructions: instructions.trim() || undefined,
      totalCalories: total.calories,
      totalProtein: total.protein,
      totalCarbs: total.carbs,
      totalFat: total.fat,
      caloriesPerServing: perServing.calories,
      proteinPerServing: perServing.protein,
      carbsPerServing: perServing.carbs,
      fatPerServing: perServing.fat,
      createdAt: recipe?.createdAt || new Date().toISOString(),
      isCustom: true,
      createdBy: 'user'
    };

    if (recipe) {
      dispatch({ type: 'UPDATE_RECIPE', payload: recipeData });
    } else {
      dispatch({ type: 'ADD_RECIPE', payload: recipeData });
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'name') setRecipeName(value);
    if (field === 'description') setDescription(value);
    if (field === 'servings') setServings(value);
    if (field === 'instructions') setInstructions(value);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60]">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[90vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-6 h-6" />
              <h2 className="text-xl font-bold">
                {recipe ? 'Edit Recipe' : 'Recipe Builder'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">Create custom recipes from your ingredients</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Recipe Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Name *
              </label>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., Chicken & Veggie Stir-Fry"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                placeholder="Brief description of your recipe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Servings *
              </label>
              <input
                type="number"
                value={servings}
                onChange={(e) => handleInputChange('servings', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors ${
                  errors.servings ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="4"
                min="1"
              />
              {errors.servings && (
                <p className="text-red-600 text-sm mt-1">{errors.servings}</p>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Ingredients</h3>
              <button
                onClick={() => setShowAddIngredient(true)}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-pink-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Ingredient
              </button>
            </div>

            {errors.ingredients && (
              <p className="text-red-600 text-sm mb-3">{errors.ingredients}</p>
            )}

            {ingredients.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <ChefHat className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No ingredients added yet</p>
                <p className="text-sm">Add ingredients to build your recipe</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{ingredient.food.name}</h4>
                        <p className="text-sm text-gray-600">{ingredient.food.category}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Amount (g)</label>
                        <input
                          type="number"
                          value={ingredient.amount}
                          onChange={(e) => handleUpdateIngredientAmount(index, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          min="1"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((ingredient.food.caloriesPer100g * ingredient.amount) / 100)} cal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Ingredient Modal */}
            {showAddIngredient && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
                <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full max-h-[70vh] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Add Ingredient</h3>
                    <button
                      onClick={() => {
                        setShowAddIngredient(false);
                        setSearchTerm('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-10"
                        placeholder="Search foods..."
                      />
                      <Search className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredFoods.map(food => (
                      <button
                        key={food.id}
                        onClick={() => handleAddIngredient(food)}
                        className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-800">{food.name}</div>
                        <div className="text-sm text-gray-600">
                          {food.category} • {food.caloriesPer100g} cal/100g
                        </div>
                      </button>
                    ))}
                    
                    {filteredFoods.length === 0 && searchTerm && (
                      <div className="text-center py-4 text-gray-500">
                        <p>No foods found</p>
                        <p className="text-sm">Try a different search term</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nutrition Summary */}
          {ingredients.length > 0 && (
            <div className="bg-pink-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-pink-600" />
                <h3 className="font-medium text-pink-800">Nutrition Summary</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-pink-700 mb-2">Total Recipe</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-bold text-orange-600">{Math.round(total.calories)}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-bold text-blue-600">{Math.round(total.protein)}g</div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-bold text-green-600">{Math.round(total.carbs)}g</div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-bold text-yellow-600">{Math.round(total.fat)}g</div>
                      <div className="text-xs text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-pink-700 mb-2">Per Serving</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-bold text-orange-600">{Math.round(perServing.calories)}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-bold text-blue-600">{Math.round(perServing.protein)}g</div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-bold text-green-600">{Math.round(perServing.carbs)}g</div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-bold text-yellow-600">{Math.round(perServing.fat)}g</div>
                      <div className="text-xs text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              rows={4}
              placeholder="Cooking instructions for your recipe..."
            />
          </div>
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
            <button
              onClick={handleSave}
              disabled={!recipeName.trim() || !servings || ingredients.length === 0}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                !recipeName.trim() || !servings || ingredients.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
              }`}
            >
              <Save className="w-4 h-4" />
              {recipe ? 'Update Recipe' : 'Save Recipe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}