import React, { useState } from 'react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import PersonalInfo from './PersonalInfo';
import Goals from './Goals';
import Preferences from './Preferences';
import Summary from './Summary';

export default function OnboardingFlow() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<User> & { preferences?: any }>({
    goal: 'maintain',
    activityLevel: 'moderate',
    dietaryPreferences: [],
    workoutStyle: [],
    macroTargets: { protein: 0, carbs: 0, fat: 0 },
    preferences: {
      notifications: {
        workouts: true,
        meals: true,
        water: true,
        reminders: true
      },
      units: 'metric',
      theme: 'light'
    }
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const calculateCalories = (data: Partial<User>) => {
    if (!data.currentWeight || !data.height || !data.age || !data.gender) return 2000;
    
    // Basic BMR calculation using Mifflin-St Jeor Equation
    let bmr;
    if (data.gender === 'male') {
      bmr = 88.362 + (13.397 * data.currentWeight) + (4.799 * data.height) - (5.677 * data.age);
    } else {
      bmr = 447.593 + (9.247 * data.currentWeight) + (3.098 * data.height) - (4.330 * data.age);
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = bmr * activityMultipliers[data.activityLevel || 'moderate'];

    // Adjust based on goal
    let calories = tdee;
    if (data.goal === 'lose') calories -= 500;
    if (data.goal === 'gain') calories += 500;

    return Math.round(calories);
  };

  const calculateMacros = (calories: number) => {
    return {
      protein: Math.round((calories * 0.25) / 4), // 25% protein
      carbs: Math.round((calories * 0.45) / 4),   // 45% carbs
      fat: Math.round((calories * 0.30) / 9)      // 30% fat
    };
  };

  const completeOnboarding = () => {
    const calories = calculateCalories(userData);
    const macros = calculateMacros(calories);
    
    const user: User = {
      id: `user-${Date.now()}`, // Generate unique ID
      name: userData.name || 'User',
      email: userData.email || 'user@example.com',
      goal: userData.goal || 'maintain',
      targetWeight: userData.targetWeight,
      currentWeight: userData.currentWeight || 70,
      height: userData.height || 170,
      age: userData.age || 30,
      gender: userData.gender || 'other',
      activityLevel: userData.activityLevel || 'moderate',
      dietaryPreferences: userData.dietaryPreferences || [],
      workoutStyle: userData.workoutStyle || [],
      dailyCalories: calories,
      macroTargets: macros,
      onboardingCompleted: true,
      preferences: userData.preferences,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    dispatch({ type: 'SET_USER', payload: user });
  };

  const updateUserData = (data: Partial<User>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 4</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {step === 1 && (
            <PersonalInfo 
              data={userData} 
              onUpdate={updateUserData}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Goals 
              data={userData}
              onUpdate={updateUserData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <Preferences 
              data={userData}
              onUpdate={updateUserData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 && (
            <Summary 
              data={userData}
              onComplete={completeOnboarding}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}