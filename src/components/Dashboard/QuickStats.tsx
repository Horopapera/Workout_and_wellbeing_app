import React from 'react';
import { Flame, Zap, Dumbbell, Droplets } from 'lucide-react';
import { User } from '../../types';

interface QuickStatsProps {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  targets: User;
  workouts: number;
  water: number;
}

export default function QuickStats({ nutrition, targets, workouts, water }: QuickStatsProps) {
  const calorieProgress = (nutrition.calories / targets.dailyCalories) * 100;
  const proteinProgress = (nutrition.protein / targets.macroTargets.protein) * 100;
  const waterProgress = (water / 2000) * 100; // 2L target

  const stats = [
    {
      icon: Flame,
      label: 'Calories',
      value: Math.round(nutrition.calories),
      target: targets.dailyCalories,
      progress: calorieProgress,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Zap,
      label: 'Protein',
      value: Math.round(nutrition.protein),
      target: targets.macroTargets.protein,
      progress: proteinProgress,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Dumbbell,
      label: 'Workouts',
      value: workouts,
      target: 1,
      progress: Math.min(workouts * 100, 100),
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Droplets,
      label: 'Water',
      value: Math.round(water / 1000 * 10) / 10,
      target: 2,
      progress: waterProgress,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      unit: 'L'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ icon: Icon, label, value, target, progress, color, bgColor, unit }) => (
        <div key={label} className={`${bgColor} p-4 rounded-xl`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-800">{value}</span>
              {unit && <span className="text-sm text-gray-600">{unit}</span>}
              <span className="text-sm text-gray-500">/{target}{unit || ''}</span>
            </div>
            
            <div className="w-full bg-white rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-300`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}