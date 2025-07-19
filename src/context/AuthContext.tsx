// src/context/AuthContext.tsx
'use client'; // This is a Client Component in Next.js 13/14 App Router

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import the initialized Auth instance - Pfad angepasst

// Define the type for the AuthContext
interface AuthContextType {
  currentUser: User | null; // The currently logged-in user
  loading: boolean; // Indicates if the authentication status is still loading
  login: (email: string, password: string) => Promise<void>; // Function to log in
  logout: () => Promise<void>; // Function to log out
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider that provides the context to the entire app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initially true, as auth status is loading

  useEffect(() => {
    // Listener for changes in authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set the current user
      setLoading(false); // Loading is complete
    });

    // Cleanup function: Remove the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to log in with email and password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error; // Re-throw the error so the calling component can handle it
    }
  };

  // Function to log out
  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Successfully logged out!');
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw error;
    }
  };

  // The value provided to the context
  const value = {
    currentUser,
    loading,
    login,
    logout,
  };

  // Render child components and provide the context value
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when auth status is loaded */}
    </AuthContext.Provider>
  );
};

// ...existing code...

// Custom Hook for easy consumption of AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ...existing code...