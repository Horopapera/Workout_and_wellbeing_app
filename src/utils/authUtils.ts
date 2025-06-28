import { supabase } from '../services/supabaseClient';
import { User } from '../types';
import { dataService } from '../services/dataService';

/**
 * Authentication utilities for Supabase
 */
export const authUtils = {
  /**
   * Gets the current user ID from Supabase
   */
  async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  },

  /**
   * Signs out the current user
   */
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Updates the user's email
   */
  async updateEmail(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  },

  /**
   * Updates the user's password
   */
  async updatePassword(password: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  /**
   * Sends a password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  /**
   * Creates a new user profile after signup
   */
  async createUserProfile(userId: string, userData: Partial<User>): Promise<User> {
    try {
      // Get user details from Auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found in Auth');
      }
      
      // Create a new user profile
      const newUser: User = {
        id: userId,
        name: userData.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: userData.email || user.email || '',
        goal: userData.goal || 'maintain',
        currentWeight: userData.currentWeight || 70,
        height: userData.height || 170,
        age: userData.age || 30,
        gender: userData.gender || 'other',
        activityLevel: userData.activityLevel || 'moderate',
        dietaryPreferences: userData.dietaryPreferences || [],
        workoutStyle: userData.workoutStyle || [],
        dailyCalories: userData.dailyCalories || 2000,
        macroTargets: userData.macroTargets || { protein: 125, carbs: 250, fat: 67 },
        onboardingCompleted: userData.onboardingCompleted || false,
        preferences: userData.preferences || {
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
      
      return newUser;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }
};