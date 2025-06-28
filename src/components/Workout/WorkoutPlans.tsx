import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Calendar, TrendingUp, Clock } from 'lucide-react';
import WorkoutList from './WorkoutList';
import WorkoutForm from './WorkoutForm';
import WorkoutSession from './WorkoutSession';
import WorkoutScheduler from './WorkoutScheduler';
import WorkoutCalendar from './WorkoutCalendar';
import WorkoutHistory from './WorkoutHistory';
import { Workout } from '../../types';

export default function WorkoutPlans() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'routines' | 'calendar' | 'history'>('routines');
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showWorkoutSession, setShowWorkoutSession] = useState(false);
  const [showWorkoutScheduler, setShowWorkoutScheduler] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  const { workouts, currentDate } = state;

  // Get today's workouts
  const todayWorkouts = workouts.filter(w => w.date === currentDate);
  const completedToday = todayWorkouts.filter(w => w.completed).length;

  const handleAddWorkout = () => {
    setEditingWorkout(null);
    setShowWorkoutForm(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowWorkoutForm(true);
  };

  const handleCloseForm = () => {
    setShowWorkoutForm(false);
    setEditingWorkout(null);
  };

  const handleStartWorkout = (workout: Workout) => {
    // Create a new workout instance for today
    const sessionWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      date: currentDate,
      completed: false,
      duration: undefined,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        id: Date.now().toString() + Math.random(),
        sets: ex.sets.map(set => ({ ...set, completed: false }))
      }))
    };
    setActiveWorkout(sessionWorkout);
    setShowWorkoutSession(true);
  };

  const handleCompleteWorkoutSession = (completedWorkout: Workout) => {
    dispatch({ type: 'ADD_WORKOUT', payload: completedWorkout });
    setShowWorkoutSession(false);
    setActiveWorkout(null);
  };

  const handleCloseWorkoutSession = () => {
    setShowWorkoutSession(false);
    setActiveWorkout(null);
  };

  const handleScheduleWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setShowWorkoutScheduler(true);
  };

  const handleCloseScheduler = () => {
    setShowWorkoutScheduler(false);
    setActiveWorkout(null);
  };

  const tabs = [
    { id: 'routines', label: 'Routines', icon: Plus },
    { id: 'calendar', label: 'Schedule', icon: Calendar },
    { id: 'history', label: 'History', icon: TrendingUp }
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Workout Plans</h1>
            <p className="text-white/80">Build and track your routines</p>
          </div>
          <button
            onClick={handleAddWorkout}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{completedToday}</div>
              <div className="text-sm text-white/80">Completed Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{workouts.length}</div>
              <div className="text-sm text-white/80">Total Routines</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'routines' && (
          <WorkoutList 
            onAddWorkout={handleAddWorkout}
            onEditWorkout={handleEditWorkout}
            onStartWorkout={handleStartWorkout}
            onScheduleWorkout={handleScheduleWorkout}
          />
        )}
        {activeTab === 'calendar' && <WorkoutCalendar />}
        {activeTab === 'history' && <WorkoutHistory />}
      </div>

      {/* Workout Form Modal */}
      {showWorkoutForm && (
        <WorkoutForm
          workout={editingWorkout}
          onClose={handleCloseForm}
        />
      )}

      {/* Workout Session Modal */}
      {showWorkoutSession && activeWorkout && (
        <WorkoutSession
          workout={activeWorkout}
          onClose={handleCloseWorkoutSession}
          onComplete={handleCompleteWorkoutSession}
        />
      )}

      {/* Workout Scheduler Modal */}
      {showWorkoutScheduler && activeWorkout && (
        <WorkoutScheduler
          workout={activeWorkout}
          onClose={handleCloseScheduler}
        />
      )}
    </div>
  );
}