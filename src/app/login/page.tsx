import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Easy Chores',
  description: 'Sign in to manage your chores',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Easy Chores
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your household chores efficiently
          </p>
        </div>
        {/* Login form will be implemented here */}
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Login functionality will be implemented with NextAuth.js
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
