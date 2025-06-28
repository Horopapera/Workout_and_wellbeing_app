import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthFlow from './components/Auth/AuthFlow';
import { supabase } from './services/supabaseClient';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import Dashboard from './components/Dashboard/Dashboard';
import { useEffect } from 'react';
import ProfilePage from './components/Profile/ProfilePage';
import WorkoutPlans from './components/Workout/WorkoutPlans';
import WorkoutSession from './components/Workout/WorkoutSession';
import DietTracker from './components/Diet/DietTracker';
import Navigation from './components/Layout/Navigation';
import { Workout } from './types';

function AppContent() {
  const { state } = useApp();
  const { dispatch } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showWorkoutSession, setShowWorkoutSession] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  // Listen for navigation events
  useEffect(() => {
    const handleNavigateToProfile = () => {
      setCurrentTab('profile');
    };

    window.addEventListener('navigate-to-profile', handleNavigateToProfile);
    return () => {
      window.removeEventListener('navigate-to-profile', handleNavigateToProfile);
    };
  }, []);

  // Check authentication status on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth flow if user is not authenticated
  if (!isAuthenticated) {
    return <AuthFlow onAuthenticated={() => setIsAuthenticated(true)} />;
  }

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
      case 'profile':
        return <ProfilePage />;
      case 'workout':
        return (
          <WorkoutPlans />
        );
      case 'diet':
        return (
          <DietTracker />
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