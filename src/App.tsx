import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import Dashboard from './components/Dashboard/Dashboard';
import WorkoutPlans from './components/Workout/WorkoutPlans';
import WorkoutSession from './components/Workout/WorkoutSession';
import Navigation from './components/Layout/Navigation';
import { Workout } from './types';

function AppContent() {
  const { state } = useApp();
  const { dispatch } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showWorkoutSession, setShowWorkoutSession] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  // Show onboarding if user hasn't completed it
  if (!state.user || !state.user.onboardingCompleted) {
    return <OnboardingFlow />;
  }

  const handleStartWorkoutFromDashboard = (workout: Workout) => {
    setActiveWorkout(workout);
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

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onStartWorkout={handleStartWorkoutFromDashboard} />;
      case 'workout':
        return (
          <WorkoutPlans />
        );
      case 'diet':
        return (
          <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-8 text-white">
              <h1 className="text-2xl font-bold">Diet Planning</h1>
              <p className="text-white/80">Plan your meals and nutrition</p>
            </div>
            <div className="p-4">
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600">Diet planning features coming soon!</p>
                <p className="text-sm text-gray-500 mt-2">Meal planning, food library, and more.</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-8 text-white">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-white/80">Track your progress over time</p>
            </div>
            <div className="p-4">
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600">Analytics features coming soon!</p>
                <p className="text-sm text-gray-500 mt-2">Charts, trends, and detailed insights.</p>
              </div>
            </div>
          </div>
        );
      case 'wellness':
        return (
          <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-8 text-white">
              <h1 className="text-2xl font-bold">Wellness</h1>
              <p className="text-white/80">Track water, sleep, and more</p>
            </div>
            <div className="p-4">
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600">Wellness features coming soon!</p>
                <p className="text-sm text-gray-500 mt-2">Water tracking, sleep logs, and reminders.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentPage()}
      
      {/* Workout Session Modal */}
      {showWorkoutSession && activeWorkout && (
        <WorkoutSession
          workout={activeWorkout}
          onClose={handleCloseWorkoutSession}
          onComplete={handleCompleteWorkoutSession}
        />
      )}
      
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;