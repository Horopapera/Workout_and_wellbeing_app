import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Camera, Timer, Heater as Water } from 'lucide-react';

interface QuickActionsProps {
  onStartWorkout?: () => void;
}

export default function QuickActions({ onStartWorkout }: QuickActionsProps) {
  const { state } = useApp();
  const { workouts } = state;
  
  // Get template workouts (routines)
  const templateWorkouts = workouts.filter(w => !w.date || w.date === 'template');
  
  const actions = [
    {
      icon: Plus,
      label: 'Log Meal',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      onClick: () => {
        // TODO: Implement meal logging
        console.log('Log meal clicked');
      }
    },
    {
      icon: Timer,
      label: 'Start Workout',
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50',
      onClick: () => {
        if (templateWorkouts.length === 0) {
          alert('No workout routines available. Create a routine first in the Workout section.');
          return;
        }
        onStartWorkout?.();
      }
    },
    {
      icon: Camera,
      label: 'Scan Food',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      onClick: () => {
        // TODO: Implement food scanning
        console.log('Scan food clicked');
      }
    },
    {
      icon: Water,
      label: 'Add Water',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      onClick: () => {
        // TODO: Implement water tracking
        console.log('Add water clicked');
      }
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label, color, bgColor, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`${bgColor} p-4 rounded-xl hover:shadow-md transition-all duration-200 group`}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}