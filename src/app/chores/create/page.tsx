'use client';

import { useRouter } from 'next/navigation';
import TopBar from '@/components/navigation/TopBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';

export default function CreateChorePage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar 
        title="Create Chore" 
        showBackButton={true}
        onBack={handleBack}
      />
      
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6">
            {/* Chore Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Chore Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter chore title"
              />
            </div>
            
            {/* Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            {/* Assignment */}
            <div>
              <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-2">
                Assignment
              </label>
              <select
                id="assignment"
                name="assignment"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="single">Single Person</option>
                <option value="alternating">Alternating</option>
              </select>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Chore
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
