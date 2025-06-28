import React from 'react';
import { Plus, Camera, Timer, Heater as Water } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: 'Log Meal',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Timer,
      label: 'Start Workout',
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Camera,
      label: 'Scan Food',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Water,
      label: 'Add Water',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label, color, bgColor }) => (
          <button
            key={label}
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