// components/UserProfile.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();

  const handleSignInClick = () => {
    console.log('Sign in button clicked - opening modal');
    openAuthModal();
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm text-gray-700 hidden md:block">
            {user.displayName || user.email}
          </span>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 font-medium"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignInClick}
      className="bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Sign In
    </button>
  );
};

export default UserProfile;