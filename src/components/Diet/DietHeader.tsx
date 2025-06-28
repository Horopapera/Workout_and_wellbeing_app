import React from 'react';
import { Calendar, ChevronDown, Library, Target, Zap } from 'lucide-react';

interface DietHeaderProps {
  selectedDate: string;
  onDateClick: () => void;
  isToday: boolean;
  isPastDate: boolean;
  onShowFoodLibrary: () => void;
  onShowMacroGoals: () => void;
  onShowQuickAdd?: () => void;
}

export default function DietHeader({ selectedDate, onDateClick, isToday, isPastDate, onShowFoodLibrary, onShowMacroGoals, onShowQuickAdd }: DietHeaderProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDateLabel = () => {
    if (isToday) return 'Today';
    if (isPastDate) return 'Past Day';
    return 'Future Day';
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-8 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Diet Tracker</h1>
          <p className="text-white/80">Track your daily nutrition</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onShowFoodLibrary}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Library className="w-5 h-5" />
          </button>
          {onShowQuickAdd && (
            <button
              onClick={onShowQuickAdd}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Zap className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onShowMacroGoals}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Target className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      <button
        onClick={onDateClick}
        className="bg-white/10 rounded-lg p-3 w-full hover:bg-white/20 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-sm font-medium text-white/80">{getDateLabel()}</div>
            <div className="text-lg font-semibold">{formatDate(selectedDate)}</div>
          </div>
          <ChevronDown className="w-5 h-5 text-white/80" />
        </div>
      </button>
    </div>
  );
}