import React, { useState } from 'react';
import { User } from '../../types';
import { TrendingDown, TrendingUp, Minus, ChevronLeft, ChevronRight } from 'lucide-react';

interface GoalsProps {
  data: Partial<User>;
  onUpdate: (data: Partial<User>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Goals({ data, onUpdate, onNext, onBack }: GoalsProps) {
  const [goal, setGoal] = useState(data.goal || 'maintain');
  const [targetWeight, setTargetWeight] = useState(data.targetWeight || '');
  const [activityLevel, setActivityLevel] = useState(data.activityLevel || 'moderate');

  const goals = [
    {
      id: 'lose',
      title: 'Lose Weight',
      description: 'Create a caloric deficit to lose weight',
      icon: TrendingDown,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'maintain',
      title: 'Maintain Weight',
      description: 'Stay at your current weight and improve fitness',
      icon: Minus,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'gain',
      title: 'Gain Weight',
      description: 'Build muscle and increase body weight',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { id: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { id: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
    { id: 'very_active', label: 'Very Active', description: 'Very hard exercise, physical job' }
  ];

  const handleNext = () => {
    onUpdate({
      goal: goal as 'lose' | 'gain' | 'maintain',
      targetWeight: targetWeight ? Number(targetWeight) : undefined,
      activityLevel: activityLevel as User['activityLevel']
    });
    onNext();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What's your goal?</h2>
        <p className="text-gray-600">We'll customize your plan based on your objectives</p>
      </div>

      <div className="space-y-6">
        {/* Goal Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Primary Goal</h3>
          <div className="space-y-3">
            {goals.map(({ id, title, description, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setGoal(id)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  goal === id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{title}</div>
                    <div className="text-sm text-gray-600">{description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Weight */}
        {goal !== 'maintain' && (
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Target Weight (kg)
            </label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter your target weight"
              min="30"
              max="300"
              step="0.1"
            />
          </div>
        )}

        {/* Activity Level */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Activity Level</h3>
          <div className="space-y-2">
            {activityLevels.map(({ id, label, description }) => (
              <button
                key={id}
                onClick={() => setActivityLevel(id)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  activityLevel === id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-800">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-200"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-all duration-200"
          >
            Continue
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}