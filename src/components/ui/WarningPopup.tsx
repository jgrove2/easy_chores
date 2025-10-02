'use client';

import { useRouter } from 'next/navigation';
import Button from './Button';

interface WarningPopupProps {
  isVisible: boolean;
}

export default function WarningPopup({ isVisible }: WarningPopupProps) {
  const router = useRouter();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Join a Group
            </h3>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            You're not currently part of any group. To start managing chores, you'll need to either join an existing group or create a new one.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={() => router.push('/settings')}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            Go to Settings
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex-1"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
