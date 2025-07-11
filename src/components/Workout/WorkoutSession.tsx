import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ChevronLeft, ChevronRight, Check, Play, Pause, RotateCcw } from 'lucide-react';
import { Workout, WorkoutExercise, WorkoutSet } from '../../types';

interface WorkoutSessionProps {
  workout: Workout;
  onClose: () => void;
  onComplete: (completedWorkout: Workout) => void;
}

export default function WorkoutSession({ workout, onClose, onComplete }: WorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [bankedReps, setBankedReps] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [startTime] = useState(new Date().toISOString());
  const [exercises, setExercises] = useState<WorkoutExercise[]>(workout.exercises);

  const currentExercise = exercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];
  const totalSets = currentExercise?.sets.length || 0;
  const targetReps = currentSet?.reps || 0;

  // Timer for session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Auto-start session
  useEffect(() => {
    setIsActive(true);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBankReps = (reps: number) => {
    const newBankedReps = Math.min(bankedReps + reps, targetReps);
    setBankedReps(newBankedReps);
  };

  const handleCompleteSet = () => {
    if (bankedReps === 0) return;

    // Update the current set
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].sets[currentSetIndex] = {
      ...currentSet,
      reps: bankedReps,
      completed: true
    };
    setExercises(updatedExercises);

    // Move to next set or exercise
    if (currentSetIndex < totalSets - 1) {
      // Move to next set in current exercise
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < exercises.length - 1) {
      // Move to next exercise
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // All exercises and sets complete - finish workout
      completeWorkout(updatedExercises);
      return;
    }

    setBankedReps(0);
  };

  const handleSkipSet = () => {
    // Mark current set as skipped (0 reps but completed)
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].sets[currentSetIndex] = {
      ...currentSet,
      reps: 0,
      completed: true
    };
    setExercises(updatedExercises);

    // Move to next set or exercise without completing
    if (currentSetIndex < totalSets - 1) {
      // Move to next set in current exercise
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < exercises.length - 1) {
      // Move to next exercise
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // All exercises and sets complete - finish workout
      completeWorkout(updatedExercises);
      return;
    }
    
    setBankedReps(0);
  };

  const handleCompleteWorkout = () => {
    // Force complete the workout even if not all sets are done
    completeWorkout(exercises);
  };

  const completeWorkout = (finalExercises: WorkoutExercise[]) => {
    const endTime = new Date().toISOString();
    const durationMinutes = Math.floor(sessionTime / 60);
    
    // Calculate calories burned (rough estimate based on duration and exercise type)
    const caloriesBurned = calculateCaloriesBurned(finalExercises, durationMinutes);
    
    const completedWorkout: Workout = {
      ...workout,
      exercises: finalExercises,
      completed: true,
      duration: durationMinutes,
      startTime,
      endTime,
      caloriesBurned
    };
    onComplete(completedWorkout);
  };

  const calculateCaloriesBurned = (exercises: WorkoutExercise[], duration: number) => {
    // Basic calorie calculation based on exercise types and duration
    // This is a simplified calculation - in a real app you'd use more sophisticated formulas
    
    let baseCaloriesPerMinute = 5; // Base metabolic rate during exercise
    
    // Adjust based on exercise types
    const hasCardio = exercises.some(ex => 
      ex.exercise.category === 'Cardio' || 
      ex.exercise.name.toLowerCase().includes('running') ||
      ex.exercise.name.toLowerCase().includes('cycling') ||
      ex.exercise.name.toLowerCase().includes('burpees')
    );
    
    const hasStrength = exercises.some(ex => 
      ex.exercise.category === 'Strength' ||
      ex.exercise.category === 'Bodyweight'
    );
    
    if (hasCardio) baseCaloriesPerMinute += 3;
    if (hasStrength) baseCaloriesPerMinute += 2;
    
    // Factor in total sets and reps
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const intensityMultiplier = Math.min(1.5, 1 + (totalSets * 0.02));
    
    return Math.round(baseCaloriesPerMinute * duration * intensityMultiplier);
  };

  const progressPercentage = bankedReps > 0 ? (bankedReps / targetReps) * 100 : 0;
  const circumference = 2 * Math.PI * 100; // radius = 100 (smaller for mobile)
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const quickRepOptions = [1, 5, 10, Math.max(1, Math.floor(targetReps / 4))].filter((val, index, arr) => arr.indexOf(val) === index && val <= targetReps);

  // Check if this is the last set of the last exercise
  const isLastSet = currentExerciseIndex === exercises.length - 1 && currentSetIndex === totalSets - 1;
  
  // Check if there are more exercises after current one
  const hasMoreExercises = currentExerciseIndex < exercises.length - 1;
  
  // Check if there are more sets in current exercise
  const hasMoreSets = currentSetIndex < totalSets - 1;
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-4 text-white flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold">{workout.name}</h1>
            <p className="text-white/80 text-sm">{formatTime(sessionTime)}</p>
          </div>

          <button
            onClick={() => setIsActive(!isActive)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>

        {/* Progress */}
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex justify-between items-center text-sm mb-2">
            <span>Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
            <span>Set {currentSetIndex + 1} of {totalSets}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExerciseIndex * totalSets + currentSetIndex + 1) / (exercises.length * totalSets)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-gray-50 pb-32">
        <div className="px-4 py-6 space-y-6">
          {/* Exercise Info */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{currentExercise?.exercise.name}</h2>
            <p className="text-gray-600 text-sm">Set {currentSetIndex + 1} • Target: {targetReps} reps</p>
            {currentSet?.weight && (
              <p className="text-gray-600 text-sm">Weight: {currentSet.weight}kg</p>
            )}
          </div>

          {/* Circular Progress */}
          <div className="flex justify-center">
            <div className="relative">
              <svg width="220" height="220" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="110"
                  cy="110"
                  r="100"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  cx="110"
                  cy="110"
                  r="100"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">{bankedReps}</span>
                <span className="text-sm text-gray-600">of {targetReps}</span>
              </div>
            </div>
          </div>

          {/* Quick Rep Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {quickRepOptions.map(reps => (
              <button
                key={reps}
                onClick={() => handleBankReps(reps)}
                disabled={bankedReps >= targetReps}
                className="bg-white border-2 border-emerald-500 text-emerald-600 py-4 px-3 rounded-xl font-bold text-lg hover:bg-emerald-50 active:bg-emerald-100 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg touch-manipulation select-none"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                +{reps}
              </button>
            ))}
          </div>

          {/* Large Add Rep Button */}
          <button
            onClick={() => handleBankReps(1)}
            disabled={bankedReps >= targetReps}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-5 px-6 rounded-xl font-bold text-xl hover:from-emerald-600 hover:to-blue-600 active:from-emerald-700 active:to-blue-700 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg touch-manipulation select-none flex items-center justify-center gap-3"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <span className="text-2xl">+</span>
            <span>Add Rep</span>
          </button>

          {/* Custom Rep Input */}
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              max={targetReps - bankedReps}
              placeholder="Custom"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center font-medium text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = parseInt((e.target as HTMLInputElement).value);
                  if (value > 0) {
                    handleBankReps(value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                const value = parseInt(input.value);
                if (value > 0) {
                  handleBankReps(value);
                  input.value = '';
                }
              }}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 active:bg-emerald-700 transition-colors text-lg"
            >
              Add
            </button>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setBankedReps(0)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 active:text-gray-900 transition-colors py-2 px-4 rounded-lg hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Actions - Fixed */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 pb-24">
        {isLastSet ? (
          // Last set - show finish workout options
          <div className="space-y-3">
            {bankedReps > 0 && (
              <button
                onClick={handleCompleteSet}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 active:from-emerald-700 active:to-blue-700 transition-colors text-lg"
              >
                <Check className="w-4 h-4" />
                Complete Set & Finish Workout
              </button>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSkipSet}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-4 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors text-lg"
              >
                Skip & Finish
              </button>
              <button
                onClick={handleCompleteWorkout}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 active:from-orange-700 active:to-red-700 transition-colors text-lg"
              >
                Finish Workout
              </button>
            </div>
          </div>
        ) : (
          // Regular set progression
          <div className="flex gap-3">
            <button
              onClick={handleSkipSet}
              className="flex-1 bg-gray-100 text-gray-700 py-4 px-4 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors text-lg"
            >
              {hasMoreSets ? 'Skip Set' : hasMoreExercises ? 'Skip to Next Exercise' : 'Skip Set'}
            </button>
            <button
              onClick={handleCompleteSet}
              disabled={bankedReps === 0}
              className={`flex-1 py-4 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-lg ${
                bankedReps === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 active:from-emerald-700 active:to-blue-700'
              }`}
            >
              <Check className="w-4 h-4" />
              {hasMoreSets ? 'Next Set' : hasMoreExercises ? 'Next Exercise' : 'Complete Set'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}