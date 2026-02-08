import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookOpen, Play, Edit3, Trash2 } from 'lucide-react';
import { MealTemplate } from '../../types';

interface MealTemplateManagerProps {
  selectedDate: string;
  onClose: () => void;
}

export default function MealTemplateManager({ selectedDate, onClose }: MealTemplateManagerProps) {
  const { state, dispatch } = useApp();
  const { mealTemplates } = state;
  const [editingTemplate, setEditingTemplate] = useState<MealTemplate | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleApplyTemplate = (template: MealTemplate) => {
    if (confirm(`Apply "${template.name}" to ${selectedDate}? This will replace any existing planned meals for this date.`)) {
      dispatch({ type: 'APPLY_MEAL_TEMPLATE', payload: { templateId: template.id, date: selectedDate } });
      onClose();
    }
  };

  const handleEditTemplate = (template: MealTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description || '');
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate || !templateName.trim()) return;

    const updatedTemplate: MealTemplate = {
      ...editingTemplate,
      name: templateName.trim(),
      description: templateDescription.trim() || undefined
    };

    dispatch({ type: 'UPDATE_MEAL_TEMPLATE', payload: updatedTemplate });
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateDescription('');
  };

  const handleDeleteTemplate = (template: MealTemplate) => {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      dispatch({ type: 'DELETE_MEAL_TEMPLATE', payload: template.id });
    }
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateDescription('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-bold">Meal Templates</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">Manage and apply meal templates</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {editingTemplate ? (
            /* Edit Template Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Edit Template</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., High Protein Day"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Brief description of this meal plan..."
                />
              </div>

              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  !templateName.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
              >
                Save Changes
              </button>
            </div>
          ) : (
            /* Template List */
            <>
              {mealTemplates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Templates Yet</h3>
                  <p className="text-sm">Create meal templates by planning a day and saving it as a template</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mealTemplates
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(template => (
                      <div key={template.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                            {template.description && (
                              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Created {formatDate(template.createdAt)}</span>
                              {template.lastUsed && (
                                <span>Last used {formatDate(template.lastUsed)}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-3">
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(template)}
                              className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>

                        {/* Nutrition Summary */}
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="grid grid-cols-4 gap-3 text-center">
                            <div>
                              <div className="text-lg font-bold text-orange-600">{Math.round(template.totalCalories)}</div>
                              <div className="text-xs text-gray-600">Calories</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-blue-600">{Math.round(template.totalProtein)}g</div>
                              <div className="text-xs text-gray-600">Protein</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600">{Math.round(template.totalCarbs)}g</div>
                              <div className="text-xs text-gray-600">Carbs</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-yellow-600">{Math.round(template.totalFat)}g</div>
                              <div className="text-xs text-gray-600">Fat</div>
                            </div>
                          </div>
                        </div>

                        {/* Meal Preview */}
                        <div className="space-y-2 mb-4">
                          {Object.entries(template.meals).map(([mealType, entries]) => {
                            if (entries.length === 0) return null;
                            return (
                              <div key={mealType} className="flex items-center gap-2 text-sm">
                                <span className="text-lg">{getMealIcon(mealType)}</span>
                                <span className="font-medium text-gray-700 capitalize">{mealType}:</span>
                                <span className="text-gray-600">
                                  {entries.length} item{entries.length !== 1 ? 's' : ''} • 
                                  {Math.round(entries.reduce((acc, entry) => acc + entry.calories, 0))} cal
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Apply Button */}
                        <button
                          onClick={() => handleApplyTemplate(template)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Apply to {selectedDate}
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!editingTemplate && (
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
  );
}