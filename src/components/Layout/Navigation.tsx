import React from 'react';
import { Home, Dumbbell, UtensilsCrossed, BarChart3, Heart } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'diet', label: 'Diet', icon: UtensilsCrossed },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'wellness', label: 'Wellness', icon: Heart }
];

export default function Navigation({ currentTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
              currentTab === id
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}