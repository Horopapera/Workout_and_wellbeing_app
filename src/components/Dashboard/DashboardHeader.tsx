import React from 'react';
import { User, Bell, Settings, UserCircle } from 'lucide-react';
import { User as UserType } from '../../types';

interface DashboardHeaderProps {
  user: UserType;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export default function DashboardHeader({ user, onNotificationClick, onProfileClick }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onProfileClick}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <UserCircle className="w-6 h-6" />
            )}
          </button>
          </div>
          <div>
            <h1 className="text-xl font-bold">Hello, {user.name}!</h1>
            <p className="text-white/80 text-sm">{today}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onNotificationClick}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {/* Notification badge - will be dynamic later */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Today's Goal</span>
          <span className="text-sm text-white/80">
            {user.goal === 'lose' ? 'Lose Weight' : 
             user.goal === 'gain' ? 'Gain Weight' : 'Maintain Weight'}
          </span>
        </div>
      </div>
    </div>
  );
}