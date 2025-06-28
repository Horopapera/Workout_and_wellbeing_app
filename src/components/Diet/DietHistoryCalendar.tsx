import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface DietHistoryCalendarProps {
  onDateSelect: (date: string) => void;
}

export default function DietHistoryCalendar({ onDateSelect }: DietHistoryCalendarProps) {
  const { state } = useApp();
  const { user, foodEntries } = state;
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!user) return null;

  // Get user's calorie target
  const dailyCalories = user.customMacroGoals?.calories || user.dailyCalories;

  // Get the first day of the month and number of days
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create array of days
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const formatDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const getDayStatus = (day: number) => {
    const dateStr = formatDate(day);
    const dayEntries = foodEntries.filter(entry => entry.date === dateStr);
    
    if (dayEntries.length === 0) {
      return { status: 'empty', calories: 0, color: 'bg-gray-100 text-gray-400' };
    }

    const totalCalories = dayEntries.reduce((acc, entry) => acc + entry.calories, 0);
    const percentage = (totalCalories / dailyCalories) * 100;

    if (percentage >= 90 && percentage <= 110) {
      return { status: 'good', calories: totalCalories, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    } else if (percentage >= 70 && percentage <= 130) {
      return { status: 'okay', calories: totalCalories, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    } else {
      return { status: 'poor', calories: totalCalories, color: 'bg-red-100 text-red-700 border-red-300' };
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isToday = (day: number) => {
    return currentMonth.getFullYear() === today.getFullYear() &&
           currentMonth.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  const isFuture = (day: number) => {
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return dayDate > today;
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-16" />;
            }

            const dayStatus = getDayStatus(day);
            const todayClass = isToday(day) ? 'ring-2 ring-orange-500' : '';
            const futureClass = isFuture(day) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md';

            return (
              <div
                key={day}
                onClick={() => !isFuture(day) && onDateSelect(formatDate(day))}
                className={`h-16 border rounded-lg flex flex-col items-center justify-center text-sm transition-all ${dayStatus.color} ${todayClass} ${futureClass}`}
              >
                <span className="font-medium">{day}</span>
                {dayStatus.status !== 'empty' && !isFuture(day) && (
                  <span className="text-xs">
                    {Math.round(dayStatus.calories)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded" />
            <span className="text-gray-600">On Target</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
            <span className="text-gray-600">Close</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
            <span className="text-gray-600">Off Target</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-gray-100 rounded" />
            <span className="text-gray-600">No Data</span>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">This Month's Summary</h3>
        
        {(() => {
          const monthEntries = foodEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth.getMonth() && 
                   entryDate.getFullYear() === currentMonth.getFullYear();
          });

          const daysWithData = new Set(monthEntries.map(entry => entry.date)).size;
          const totalCalories = monthEntries.reduce((acc, entry) => acc + entry.calories, 0);
          const avgCalories = daysWithData > 0 ? totalCalories / daysWithData : 0;

          const onTargetDays = Array.from(new Set(monthEntries.map(entry => entry.date)))
            .filter(date => {
              const dayEntries = monthEntries.filter(entry => entry.date === date);
              const dayCalories = dayEntries.reduce((acc, entry) => acc + entry.calories, 0);
              const percentage = (dayCalories / dailyCalories) * 100;
              return percentage >= 90 && percentage <= 110;
            }).length;

          return (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{daysWithData}</div>
                <div className="text-sm text-gray-600">Days Logged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(avgCalories)}</div>
                <div className="text-sm text-gray-600">Avg Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{onTargetDays}</div>
                <div className="text-sm text-gray-600">On Target Days</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}