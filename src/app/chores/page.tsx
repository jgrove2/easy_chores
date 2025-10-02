'use client';

import Link from 'next/link';
import TopBar from '@/components/navigation/TopBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';

export default function ChoresPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="Chores" />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="flex justify-end items-center mb-6">
          <Link 
            href="/chores/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Chore
          </Link>
        </div>
        
        <div className="space-y-4">
          {/* Chore List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Chores</h2>
            <p className="text-gray-600">Chore management list will be displayed here</p>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
