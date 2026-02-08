import React, { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { migrationUtils } from '../utils/dataUtils';
import { loadAppData } from '../utils/localStorage';

interface MigrationPromptProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

export default function MigrationPrompt({ userId, onComplete, onSkip }: MigrationPromptProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleMigrate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load data from localStorage
      const localData = loadAppData(userId);
      
      if (!localData) {
        setError('No local data found to migrate');
        setIsLoading(false);
        return;
      }
      
      // Migrate data to Supabase
      const success = await migrationUtils.migrateLocalDataToSupabase(userId, localData);
      
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setError('Failed to migrate data. Please try again.');
      }
    } catch (error) {
      console.error('Migration error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full m-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Migrate Your Data</h2>
          <p className="text-gray-600">
            We've detected data from a previous session. Would you like to migrate it to your new account?
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-green-700 text-sm">Data migrated successfully! Redirecting...</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            disabled={isLoading || success}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip
          </button>
          <button
            onClick={handleMigrate}
            disabled={isLoading || success}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Migrating...
              </>
            ) : success ? (
              <>
                <Check className="w-4 h-4" />
                Completed
              </>
            ) : (
              'Migrate Data'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}