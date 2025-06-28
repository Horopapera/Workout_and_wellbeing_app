import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Repeat, Save } from 'lucide-react';
import { Workout } from '../../types';

interface WorkoutSchedulerProps {
  workout: Workout;
  onClose: () => void;
}

export default function WorkoutScheduler({ workout, onClose }: WorkoutSchedulerProps) {
  const { dispatch } = useApp();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [repeatType, setRepeatType] = useState<'weekly' | 'fortnightly' | 'monthly'>('weekly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const daysOfWeek = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' }
  ];

  const repeatOptions = [
    { id: 'weekly', label: 'Weekly', description: 'Repeat every week' },
    { id: 'fortnightly', label: 'Fortnightly', description: 'Repeat every 2 weeks' },
    { id: 'monthly', label: 'Monthly', description: 'Repeat every month' }
  ];

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const generateScheduledWorkouts = () => {
    if (selectedDays.length === 0) return [];

    const scheduledWorkouts: Workout[] = [];
    const start = new Date(startDate);
    const endDate = new Date(start);
    endDate.setMonth(endDate.getMonth() + 3); // Schedule for 3 months

    let currentDate = new Date(start);

    while (currentDate <= endDate) {
      if (selectedDays.includes(currentDate.getDay())) {
        const scheduledWorkout: Workout = {
          ...workout,
          id: `${workout.id}-${currentDate.toISOString().split('T')[0]}`,
          date: currentDate.toISOString().split('T')[0],
          completed: false,
          exercises: workout.exercises.map(ex => ({
            ...ex,
            id: `${ex.id}-${Date.now()}-${Math.random()}`,
            sets: ex.sets.map(set => ({ ...set, completed: false }))
          }))
        };
        scheduledWorkouts.push(scheduledWorkout);
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);

      // Skip ahead based on repeat type
      if (repeatType === 'fortnightly' && currentDate.getDay() === start.getDay()) {
        currentDate.setDate(currentDate.getDate() + 7); // Skip one week
      } else if (repeatType === 'monthly' && currentDate.getDate() === start.getDate()) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(start.getDate());
      }
    }

    return scheduledWorkouts;
  };

  const handleSchedule = () => {
    const scheduledWorkouts = generateScheduledWorkouts();
    
    scheduledWorkouts.forEach(scheduledWorkout => {
      dispatch({ type: 'ADD_WORKOUT', payload: scheduledWorkout });
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Schedule Workout</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">{workout.name}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Days
            </label>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`p-3 rounded-lg text-center transition-all duration-200 ${
                    selectedDays.includes(day.id)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xs font-medium">{day.short}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Repeat Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Repeat Schedule
            </label>
            <div className="space-y-2">
              {repeatOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setRepeatType(option.id as any)}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                    repeatType === option.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Repeat className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedDays.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Schedule Preview</h3>
              <p className="text-sm text-blue-700">
                {workout.name} will be scheduled on{' '}
                {selectedDays.map(dayId => daysOfWeek[dayId].name).join(', ')}{' '}
                {repeatType === 'weekly' ? 'every week' : 
                 repeatType === 'fortnightly' ? 'every 2 weeks' : 'every month'}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Starting from {new Date(startDate).toLocaleDateString()}
              </p>
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
              onClick={handleSchedule}
              disabled={selectedDays.length === 0}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                selectedDays.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600'
              }`}
            >
              <Save className="w-4 h-4" />
              Schedule Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}