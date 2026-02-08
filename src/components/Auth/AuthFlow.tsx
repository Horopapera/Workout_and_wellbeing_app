import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../services/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { dataService } from '../../services/dataService';
import { User } from '../../types';
import LoadingScreen from '../Shared/LoadingScreen';

interface AuthFlowProps {
  onAuthenticated: () => void;
}

export default function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const { dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Checking your session...');
  const [error, setError] = useState<string | null>(null);

  const handleUserAuthenticated = useCallback(async (userId: string) => {
    try {
      // Get user profile from Supabase
      let userProfile = await dataService.getUser(userId);
      
      if (!userProfile) {
        // User exists in Auth but not in the database yet
        // Create a new user profile
        setLoadingMessage('Creating your profile...');
        
        // Get user details from Auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not found in Auth');
        }
        
        // Create a new user profile
        const newUser: User = {
          id: userId,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          goal: 'maintain',
          currentWeight: 70,
          height: 170,
          age: 30,
          gender: 'other',
          activityLevel: 'moderate',
          dietaryPreferences: [],
          workoutStyle: [],
          dailyCalories: 2000,
          macroTargets: { protein: 125, carbs: 250, fat: 67 },
          onboardingCompleted: false,
          preferences: {
            notifications: {
              workouts: true,
              meals: true,
              water: true,
              reminders: true
            },
            units: 'metric',
            theme: 'light'
          },
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        // Save the new user profile
        await dataService.saveUser(newUser);
        userProfile = newUser;
      } else {
        // Update last login time
        userProfile.lastLoginAt = new Date().toISOString();
        await dataService.saveUser(userProfile);
      }
      
      // Load user data
      setLoadingMessage('Loading your data...');
      
      try {
        // Load all user data from data service
        const [
          foodEntries,
          plannedFoodEntries,
          mealTemplates,
          workouts,
          recipes,
          wellnessEntries,
          customFoods,
          notifications,
          quickAddEntries
        ] = await Promise.all([
          dataService.getFoodEntries(userId),
          dataService.getPlannedFoodEntries(userId),
          dataService.getMealTemplates(userId),
          dataService.getWorkouts(userId),
          dataService.getRecipes(userId),
          dataService.getWellnessEntries(userId),
          dataService.getCustomFoods(userId),
          dataService.getNotifications(userId),
          dataService.getQuickAddEntries(userId)
        ]);
        
        // Load all data into app state
        dispatch({
          type: 'LOAD_USER_DATA',
          payload: {
            user: userProfile,
            appData: {
              foodEntries,
              plannedFoodEntries,
              mealTemplates,
              workouts,
              recipes,
              wellnessEntries,
              customFoods,
              notifications: notifications.length > 0 ? notifications : [
                {
                  id: '1',
                  type: 'reminder',
                  title: 'Welcome back!',
                  message: 'Continue your fitness journey today',
                  timestamp: new Date().toISOString(),
                  read: false
                }
              ],
              quickAddEntries
            }
          }
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
        // Still proceed with authentication, but with empty data
        dispatch({ type: 'SET_USER', payload: userProfile });
      }
      
      // Complete authentication
      setIsLoading(false);
      onAuthenticated();
    } catch (error) {
      console.error('Error handling user authentication:', error);
      setError('Failed to load your profile. Please try again.');
      setIsLoading(false);
    }
  }, [dispatch, onAuthenticated]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        setLoadingMessage('Checking your session...');

        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setLoadingMessage('Loading your profile...');
          await handleUserAuthenticated(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setError('Failed to check your session. Please try again.');
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        setLoadingMessage('Loading your profile...');
        await handleUserAuthenticated(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT_USER' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleUserAuthenticated, dispatch]);

  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-600">Sign in or create an account to continue your fitness journey</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#10b981',
                  brandAccent: '#0ea5e9',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
          magicLink={false}
          showLinks={true}
          view="sign_in"
        />
      </div>
    </div>
  );
}