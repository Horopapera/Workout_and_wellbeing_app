import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, Globe, Palette, Shield, Download, Trash2, Save } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { state, dispatch } = useApp();
  const { user } = state;
  
  const [settings, setSettings] = useState({
    notifications: {
      workouts: user?.preferences?.notifications?.workouts ?? true,
      meals: user?.preferences?.notifications?.meals ?? true,
      water: user?.preferences?.notifications?.water ?? true,
      reminders: user?.preferences?.notifications?.reminders ?? true
    },
    units: user?.preferences?.units ?? 'metric',
    theme: user?.preferences?.theme ?? 'light'
  });

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: {
        notifications: settings.notifications,
        units: settings.units as 'metric' | 'imperial',
        theme: settings.theme as 'light' | 'dark'
      }
    };

    dispatch({ type: 'SET_USER', payload: updatedUser });
    onClose();
  };

  const handleExportData = () => {
    alert('Data export feature will be available in a future update.');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion feature will be available in a future update.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col mb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Settings</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-2">Customize your app experience</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">Workout Reminders</span>
                  <p className="text-sm text-gray-600">Get notified about scheduled workouts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.workouts}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, workouts: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">Meal Reminders</span>
                  <p className="text-sm text-gray-600">Reminders to log your meals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.meals}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, meals: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">Water Reminders</span>
                  <p className="text-sm text-gray-600">Stay hydrated throughout the day</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.water}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, water: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">General Reminders</span>
                  <p className="text-sm text-gray-600">Tips and motivational messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.reminders}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, reminders: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Units */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Units</h3>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="units"
                  value="metric"
                  checked={settings.units === 'metric'}
                  onChange={(e) => setSettings({ ...settings, units: e.target.value as 'metric' | 'imperial' })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <div>
                  <span className="font-medium text-gray-800">Metric</span>
                  <p className="text-sm text-gray-600">Kilograms, centimeters, liters</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="units"
                  value="imperial"
                  checked={settings.units === 'imperial'}
                  onChange={(e) => setSettings({ ...settings, units: e.target.value as 'metric' | 'imperial' })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <div>
                  <span className="font-medium text-gray-800">Imperial</span>
                  <p className="text-sm text-gray-600">Pounds, feet/inches, fluid ounces</p>
                </div>
              </label>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Theme</h3>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-800">Light Mode</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-800">Dark Mode</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
              </label>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">Privacy & Data</h3>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <Download className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-800">Export Data</span>
                  <p className="text-sm text-gray-600">Download your data as CSV</p>
                </div>
              </button>
              
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
                <div>
                  <span className="font-medium text-red-800">Delete Account</span>
                  <p className="text-sm text-red-600">Permanently delete your account and data</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}