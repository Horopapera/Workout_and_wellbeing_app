import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, Clock, Plus, CalendarPlus } from 'lucide-react';
import DayWorkoutView from './DayWorkoutView';

export default function WorkoutCalendar() {
  const { state } = useApp();
  const { workouts } = state;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Get the first day of the month and number of days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
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
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const getWorkoutsForDay = (day: number) => {
    const dateStr = formatDate(day);
    return workouts.filter(w => w.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
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
    return currentDate.getFullYear() === today.getFullYear() &&
           currentDate.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
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
              return <div key={index} className="h-12" />;
            }

            const dayWorkouts = getWorkoutsForDay(day);
            const completedWorkouts = dayWorkouts.filter(w => w.completed);
            const hasWorkouts = dayWorkouts.length > 0;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(formatDate(day))}
                className={`h-12 border border-gray-100 rounded-lg flex flex-col items-center justify-center text-sm relative ${
                  isToday(day) ? 'bg-emerald-100 border-emerald-300' : 'bg-white hover:bg-gray-50'
                } transition-colors cursor-pointer`}
              >
                <span className={`font-medium ${isToday(day) ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {day}
                </span>
                
                {hasWorkouts && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayWorkouts.slice(0, 3).map((workout, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          workout.completed ? 'bg-emerald-500' : 'bg-orange-400'
                        }`}
                      />
                    ))}
                    {dayWorkouts.length > 3 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-orange-400 rounded-full" />
            <span>Scheduled</span>
          </div>
        </div>
      </div>

      {/* Day Workout View Modal */}
      {selectedDay && (
        <DayWorkoutView
          date={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {/* Today's Workouts */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Today's Workouts
        </h3>
        
        {getWorkoutsForDay(new Date().getDate()).length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CalendarPlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No workouts scheduled for today</p>
            <p className="text-sm">Schedule a workout routine to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {getWorkoutsForDay(new Date().getDate()).map(workout => (
              <div key={workout.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  workout.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {workout.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{workout.name}</h4>
                  <p className="text-sm text-gray-600">
                    {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                    {workout.duration && ` • ${workout.duration} min`}
                  </p>
                </div>
                <span className={`text-sm font-medium ${
                  workout.completed ? 'text-emerald-600' : 'text-orange-600'
                }`}>
                  {workout.completed ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}