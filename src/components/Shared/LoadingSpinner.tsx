import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );
}