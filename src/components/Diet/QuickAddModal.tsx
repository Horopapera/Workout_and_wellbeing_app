import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Zap, Save } from 'lucide-react';
import { QuickAddEntry } from '../../types';

interface QuickAddModalProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  selectedDate: string;
  isPlanned?: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ mealType, selectedDate, isPlanned = false, onClose }: QuickAddModalProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required';
    }

    if (!formData.calories || Number(formData.calories) <= 0) {
      newErrors.calories = 'Calories must be greater than 0';
    }

    if (formData.protein && Number(formData.protein) < 0) {
      newErrors.protein = 'Protein cannot be negative';
    }

    if (formData.carbs && Number(formData.carbs) < 0) {
      newErrors.carbs = 'Carbs cannot be negative';
    }

    if (formData.fat && Number(formData.fat) < 0) {
      newErrors.fat = 'Fat cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const quickAddEntry: QuickAddEntry = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      calories: Number(formData.calories),
      protein: Number(formData.protein) || 0,
      carbs: Number(formData.carbs) || 0,
      fat: Number(formData.fat) || 0,
      mealType,
      date: selectedDate,
      createdAt: new Date().toISOString()
    };

    // Create a temporary food object for the entry
    const tempFood = {
      id: `quick-${Date.now()}`,
      name: formData.name.trim(),
      caloriesPer100g: Number(formData.calories),
      proteinPer100g: Number(formData.protein) || 0,
      carbsPer100g: Number(formData.carbs) || 0,
      fatPer100g: Number(formData.fat) || 0,
      category: 'Quick Add'
    };

    const foodEntry = {
      id: Date.now().toString(),
      foodId: tempFood.id,
      food: tempFood,
      amount: 100, // Quick add assumes the values are for the total portion
      calories: Number(formData.calories),
      protein: Number(formData.protein) || 0,
      carbs: Number(formData.carbs) || 0,
      fat: Number(formData.fat) || 0,
      mealType,
      date: selectedDate,
      createdAt: new Date().toISOString()
    };

    if (isPlanned) {
      dispatch({ type: 'ADD_PLANNED_FOOD_ENTRY', payload: foodEntry });
    } else {
      dispatch({ type: 'ADD_FOOD_ENTRY', payload: foodEntry });
    }

    dispatch({ type: 'ADD_QUICK_ADD_ENTRY', payload: quickAddEntry });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60]">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <h2 className="text-xl font-bold">Quick Add</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">
            Quickly log nutrition when you know the values
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-800 mb-2">Quick Add Info</h3>
            <p className="text-sm text-blue-700">
              Use this when you have nutrition information from a food label or restaurant menu but the food isn't in our library.
            </p>
          </div>

          {/* Food Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Restaurant Burger, Homemade Smoothie"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Nutrition Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories *
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => handleInputChange('calories', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.calories ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.calories && (
                <p className="text-red-600 text-sm mt-1">{errors.calories}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protein (g)
              </label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => handleInputChange('protein', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.protein ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors.protein && (
                <p className="text-red-600 text-sm mt-1">{errors.protein}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carbs (g)
              </label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => handleInputChange('carbs', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.carbs ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors.carbs && (
                <p className="text-red-600 text-sm mt-1">{errors.carbs}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fat (g)
              </label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) => handleInputChange('fat', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fat ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors.fat && (
                <p className="text-red-600 text-sm mt-1">{errors.fat}</p>
              )}
            </div>
          </div>

          {/* Preview */}
          {formData.calories && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">Preview</h3>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white rounded-lg p-2">
                  <div className="text-lg font-bold text-orange-600">{formData.calories || 0}</div>
                  <div className="text-xs text-gray-600">Calories</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-600">{formData.protein || 0}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-lg font-bold text-green-600">{formData.carbs || 0}g</div>
                  <div className="text-xs text-gray-600">Carbs</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-lg font-bold text-yellow-600">{formData.fat || 0}g</div>
                  <div className="text-xs text-gray-600">Fat</div>
                </div>
              </div>
            </div>
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
            <button
              onClick={handleSave}
              disabled={!formData.name.trim() || !formData.calories}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                !formData.name.trim() || !formData.calories
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
              }`}
            >
              <Save className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}