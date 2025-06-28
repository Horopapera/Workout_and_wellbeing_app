import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Edit3, LogOut, Camera, Save, X, Target, Activity, Calendar, Award } from 'lucide-react';
import { User as UserType } from '../../types';
import SettingsModal from './SettingsModal';

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const { user, workouts, foodEntries } = state;
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentWeight: user?.currentWeight?.toString() || '',
    targetWeight: user?.targetWeight?.toString() || '',
    goal: user?.goal || 'maintain'
  });

  if (!user) return null;

  // Calculate stats
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const totalCaloriesLogged = foodEntries.reduce((acc, entry) => acc + entry.calories, 0);
  const daysTracked = new Set(foodEntries.map(entry => entry.date)).size;
  const currentStreak = 7; // Placeholder - would calculate actual streak

  const handleSaveProfile = () => {
    const updatedUser: UserType = {
      ...user,
      name: editForm.name,
      email: editForm.email,
      currentWeight: Number(editForm.currentWeight) || user.currentWeight,
      targetWeight: editForm.targetWeight ? Number(editForm.targetWeight) : user.targetWeight,
      goal: editForm.goal as 'lose' | 'gain' | 'maintain'
    };

    dispatch({ type: 'SET_USER', payload: updatedUser });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? This will clear all your data.')) {
      dispatch({ type: 'LOGOUT_USER' });
    }
  };

  const goalText = {
    lose: 'Lose Weight',
    gain: 'Gain Weight',
    maintain: 'Maintain Weight'
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-white/20 text-white placeholder-white/70 px-3 py-2 rounded-lg border border-white/30 focus:border-white focus:outline-none"
                placeholder="Your name"
              />
            ) : (
              <h2 className="text-xl font-bold">{user.name}</h2>
            )}
            
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full bg-white/20 text-white placeholder-white/70 px-3 py-2 rounded-lg border border-white/30 focus:border-white focus:outline-none mt-2"
                placeholder="your.email@example.com"
              />
            ) : (
              <p className="text-white/80">{user.email}</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{completedWorkouts}</div>
              <div className="text-sm text-white/80">Workouts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{daysTracked}</div>
              <div className="text-sm text-white/80">Days Tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Goals & Progress */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals & Progress</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-medium text-gray-800">Primary Goal</span>
                  {isEditing ? (
                    <select
                      value={editForm.goal}
                      onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                      className="block w-full mt-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="lose">Lose Weight</option>
                      <option value="gain">Gain Weight</option>
                      <option value="maintain">Maintain Weight</option>
                    </select>
                  ) : (
                    <div className="text-sm text-gray-600">{goalText[user.goal]}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Current Weight</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.currentWeight}
                    onChange={(e) => setEditForm({ ...editForm, currentWeight: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="kg"
                  />
                ) : (
                  <div className="text-lg font-bold text-blue-600">{user.currentWeight}kg</div>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Target Weight</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.targetWeight}
                    onChange={(e) => setEditForm({ ...editForm, targetWeight: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="kg"
                  />
                ) : (
                  <div className="text-lg font-bold text-emerald-600">
                    {user.targetWeight ? `${user.targetWeight}kg` : 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{Math.round(totalCaloriesLogged / 1000)}k</div>
              <div className="text-sm text-gray-600">Calories Logged</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isEditing && (
            <button
              onClick={handleSaveProfile}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
          
          <button
            onClick={() => setShowSettings(true)}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Settings & Preferences
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}