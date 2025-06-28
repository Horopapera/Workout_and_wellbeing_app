import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import { loadCurrentSession, findUserById, saveUserAccount } from '../../utils/authStorage';
import { dataService } from '../../services/dataService';

interface AuthFlowProps {
  onAuthenticated: () => void;
}

export default function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const { dispatch } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const session = loadCurrentSession();
        if (session) {
          const user = findUserById(session.userId);
          if (user) {
            // Load user and their data
            await handleUserLogin(session.userId);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to restore session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkExistingSession();
  }, []);

  const handleUserLogin = async (userId: string) => {
    try {
      const userAccount = findUserById(userId);
      if (!userAccount) {
        throw new Error('User account not found');
      }

      // Update last login time
      const updatedAccount = {
        ...userAccount,
        lastLoginAt: new Date().toISOString()
      };
      saveUserAccount(updatedAccount);

      // Load user profile
      dispatch({ type: 'SET_USER', payload: userAccount.profile });

      // Load user's app data
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
            user: userAccount.profile,
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
        dispatch({ type: 'SET_USER', payload: userAccount.profile });
      }

      onAuthenticated();
    } catch (error) {
      console.error('Login failed:', error);
      setIsCheckingSession(false);
    }
  };

  const handleUserSignup = async (userId: string) => {
    await handleUserLogin(userId);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {authMode === 'login' ? (
        <LoginScreen
          onLogin={handleUserLogin}
          onSwitchToSignup={() => setAuthMode('signup')}
        />
      ) : (
        <SignupScreen
          onSignup={handleUserSignup}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      )}
    </>
  );
}