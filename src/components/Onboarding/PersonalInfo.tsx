import React, { useState } from 'react';
import { User } from '../../types';
import { User as UserIcon, ChevronRight } from 'lucide-react';

interface PersonalInfoProps {
  data: Partial<User>;
  onUpdate: (data: Partial<User>) => void;
  onNext: () => void;
}

export default function PersonalInfo({ data, onUpdate, onNext }: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    email: data.email || '',
    age: data.age || '',
    gender: data.gender || '',
    currentWeight: data.currentWeight || '',
    height: data.height || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
      gender: formData.gender as 'male' | 'female' | 'other',
      currentWeight: Number(formData.currentWeight),
      height: Number(formData.height)
    });
    onNext();
  };

  const isValid = formData.name && formData.age && formData.gender && 
                  formData.currentWeight && formData.height;

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's get to know you</h2>
        <p className="text-gray-600">Tell us about yourself to personalize your experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Enter your email"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="25"
              min="13"
              max="120"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.currentWeight}
              onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="70"
              min="30"
              max="300"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="170"
              min="100"
              max="250"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          Continue
          <ChevronRight size={20} />
        </button>
      </form>
    </div>
  );
}