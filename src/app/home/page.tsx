import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Easy Chores',
  description: 'Your chore dashboard',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Chore Dashboard</h1>
        
        <div className="space-y-6">
          {/* Today&apos;s Chores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Chores</h2>
            <p className="text-gray-600">Today&apos;s chore list will be displayed here</p>
          </div>
          
          {/* Upcoming Chores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Chores</h2>
            <p className="text-gray-600">Upcoming chores will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}