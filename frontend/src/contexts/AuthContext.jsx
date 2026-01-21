
import React, { createContext, useContext, useEffect, useState } from 'react'
// import dataService from '../services/dataService'
import apiClient from '../services/api';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children, setError }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage (from backend login)
    const sessionData = localStorage.getItem('user');
    if (sessionData) {
      const user = JSON.parse(sessionData);
      setUser(user);
      setUserProfile(user);
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { email, password });

      const user = res.data;
      setUser(user);
      setUserProfile(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, error: null };
    } catch (error) {
      // Axios error handling
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      return { user: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('user');
      localStorage.removeItem('neenu_auth_session');
      localStorage.removeItem('adminUser');
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);

      // Check if user already exists
      const existingUser = dataService.getUserByEmail(userData.email);
      if (existingUser) {
        return { user: null, error: { message: 'User already exists with this email' } };
      }

      // Create new user
      const newUser = dataService.addUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'customer',
        phone: userData.phone || '',
        memberSince: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        totalSaved: 0,
        isActive: true
      });

      if (newUser) {
        setUser(newUser);
        setUserProfile(newUser);

        // Save session
        localStorage.setItem('neenu_auth_session', JSON.stringify({
          userId: newUser.id,
          timestamp: Date.now()
        }));

        return { user: newUser, error: null };
      } else {
        return { user: null, error: { message: 'Failed to create user' } };
      }
    } catch (error) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) return { error: { message: 'No user logged in' } };

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setUserProfile(updatedUser);

      // In a real app, you'd update the database here
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
