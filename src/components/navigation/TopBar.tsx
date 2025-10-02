import React, { JSX } from 'react';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export default function TopBar({ 
  title, 
  showBackButton = false, 
  actions, 
  onBack 
}: TopBarProps): JSX.Element {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    </header>
  );
}
