'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword, 
  logout,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  onAuthStateChange
} from '../lib/firebase';

// Define the user profile interface
interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Add any additional profile fields you want to store
  bio?: string;
  location?: string;
  preferences?: any;
  soulProfile?: any;
}

// Define the authentication context interface
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ user: User | null; error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
  refreshUserProfile: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile from Firestore
  const fetchUserProfile = async (user: User) => {
    try {
      const { data, error } = await getUserProfile(user.uid);
      if (error) {
        console.error('Error fetching user profile:', error);
        // Create a basic profile if none exists
        const basicProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        };
        await createUserProfile(user.uid, basicProfile);
        setUserProfile(basicProfile);
      } else {
        setUserProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Function to refresh user profile
  const refreshUserProfile = async () => {
    if (currentUser) {
      await fetchUserProfile(currentUser);
    }
  };

  // Function to update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) {
      return { error: 'No user logged in' };
    }

    try {
      const { error } = await updateUserProfile(currentUser.uid, updates);
      if (!error) {
        // Update local state
        setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      }
      return { error };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  // Set up authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // User is signed in, fetch their profile
        await fetchUserProfile(user);
      } else {
        // User is signed out, clear profile
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Context value
  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    logout,
    updateProfile,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 