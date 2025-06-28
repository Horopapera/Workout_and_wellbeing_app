import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import { loadCurrentSession, findUserById, saveUserAccount } from '../../utils/authStorage';
import { loadAppData } from '../../utils/localStorage';

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
      const appData = loadAppData(userId);
      if (appData) {
        dispatch({ 
          type: 'LOAD_USER_DATA', 
          payload: { 
            user: userAccount.profile, 
            appData 
          } 
        });
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