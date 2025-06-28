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
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // Workout complete
      completeWorkout(updatedExercises);
      return;
    }

    setBankedReps(0);
  };

  const handleSkipSet = () => {
    // Move to next set or exercise without completing
    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // End workout
      completeWorkout(exercises);
    }
    setBankedReps(0);
  };

  const completeWorkout = (finalExercises: WorkoutExercise[]) => {
    const completedWorkout: Workout = {
      ...workout,
      exercises: finalExercises,
      completed: true,
      duration: Math.floor(sessionTime / 60)
    };
    onComplete(completedWorkout);
  };

  const progressPercentage = bankedReps > 0 ? (bankedReps / targetReps) * 100 : 0;
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const quickRepOptions = [1, 5, 10, Math.max(1, Math.floor(targetReps / 4))].filter((val, index, arr) => arr.indexOf(val) === index && val <= targetReps);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">{workout.name}</h1>
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
          <div className="flex justify-between items-center text-sm">
            <span>Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
            <span>Set {currentSetIndex + 1} of {totalSets}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExerciseIndex * totalSets + currentSetIndex + 1) / (exercises.length * totalSets)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
        {/* Exercise Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentExercise?.exercise.name}</h2>
          <p className="text-gray-600">Set {currentSetIndex + 1} • Target: {targetReps} reps</p>
          {currentSet?.weight && (
            <p className="text-gray-600">Weight: {currentSet.weight}kg</p>
          )}
        </div>

        {/* Circular Progress */}
        <div className="relative mb-8">
          <svg width="280" height="280" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="12"
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
            <span className="text-5xl font-bold text-gray-800">{bankedReps}</span>
            <span className="text-lg text-gray-600">of {targetReps}</span>
          </div>
        </div>

        {/* Quick Rep Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-8 w-full max-w-sm">
          {quickRepOptions.map(reps => (
            <button
              key={reps}
              onClick={() => handleBankReps(reps)}
              disabled={bankedReps >= targetReps}
              className="bg-white border-2 border-emerald-500 text-emerald-600 py-3 px-4 rounded-xl font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +{reps}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={() => setBankedReps(0)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t border-gray-200 p-4 pb-8">
        <div className="flex gap-3">
          <button
            onClick={handleSkipSet}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Skip Set
          </button>
          <button
            onClick={handleCompleteSet}
            disabled={bankedReps === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              bankedReps === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600'
            }`}
          >
            <Check className="w-4 h-4" />
            Complete Set
          </button>
        </div>
      </div>
    </div>
  );
}