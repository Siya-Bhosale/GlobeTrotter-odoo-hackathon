'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Trip, City, Activity, TripStop, SupportedCurrency, Expense } from '@/lib/types';
import confetti from 'canvas-confetti';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from '@/lib/firebase';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  trips: Trip[];
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  cities: City[];
  activities: Activity[];
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  formatCurrency: (amount: number) => string;
  isCreateTripOpen: boolean;
  setIsCreateTripOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  selectedCityForTrip: City | null;
  setSelectedCityForTrip: (city: City | null) => void;
  isAddActivityOpen: boolean;
  setIsAddActivityOpen: (open: boolean) => void;
  activityTargetStopId: string | null;
  setActivityTargetStopId: (stopId: string | null) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  fetchTrips: () => Promise<void>;
  fetchTripById: (id: string) => Promise<Trip | null>;
  createTrip: (data: Partial<Trip> & { selected_cities?: string[] }) => Promise<Trip | null>;
  updateTrip: (id: string, data: Partial<Trip>) => Promise<Trip | null>;
  deleteTrip: (id: string) => Promise<boolean>;
  addStop: (tripId: string, cityId: string) => Promise<void>;
  reorderStops: (tripId: string, orderedStopIds: string[]) => Promise<void>;
  deleteStop: (tripId: string, stopId: string) => Promise<void>;
  addActivityItem: (tripId: string, itemData: any) => Promise<void>;
  deleteActivityItem: (itemId: string) => Promise<void>;
  addExpense: (tripId: string, expenseData: Partial<Expense>) => Promise<void>;
  deleteExpense: (tripId: string, expenseId: string) => Promise<void>;
  triggerConfetti: () => void;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  forkTrip: (shareToken: string) => Promise<Trip | null>;
  sendSignupOtp: (email: string, name?: string) => Promise<{ success: boolean; simulated_otp?: string; message: string }>;
  verifySignupOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  firebaseSignUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  firebaseLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  googleSignIn: () => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CURRENCY_RATES: Record<SupportedCurrency, { rate: number; symbol: string }> = {
  USD: { rate: 1.0, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  GBP: { rate: 0.79, symbol: '£' },
  JPY: { rate: 155.0, symbol: '¥' },
  INR: { rate: 83.5, symbol: '₹' },
  AUD: { rate: 1.52, symbol: 'A$' },
  CAD: { rate: 1.36, symbol: 'C$' },
  CHF: { rate: 0.90, symbol: 'CHF ' },
  AED: { rate: 3.67, symbol: 'AED ' },
  IDR: { rate: 16200.0, symbol: 'Rp ' },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [isCreateTripOpen, setIsCreateTripOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedCityForTrip, setSelectedCityForTrip] = useState<City | null>(null);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState<boolean>(false);
  const [activityTargetStopId, setActivityTargetStopId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#38bdf8', '#fb7185', '#f59e0b', '#8b5cf6']
      });
    } catch (e) {
      // safe fallback if not supported
    }
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = amount * info.rate;
    if (currency === 'JPY' || currency === 'IDR') {
      return `${info.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${info.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  // Initial Data Fetching
  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities');
      const data = await res.json();
      if (data.cities) setCities(data.cities);
    } catch (e) {
      console.error('Error fetching cities', e);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.activities) setActivities(data.activities);
    } catch (e) {
      console.error('Error fetching activities', e);
    }
  };

  const fetchTrips = async () => {
    try {
      const userId = user?.id || 'user-demo-01';
      const res = await fetch(`/api/trips?userId=${userId}`);
      const data = await res.json();
      if (data.trips) {
        setTrips(data.trips);
        if (!activeTrip && data.trips.length > 0) {
          setActiveTrip(data.trips[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching trips', e);
    }
  };

  const fetchTripById = async (id: string): Promise<Trip | null> => {
    try {
      const res = await fetch(`/api/trips/${id}`);
      const data = await res.json();
      if (data.trip) {
        setActiveTrip(data.trip);
        // also sync into trips array
        setTrips(prev => prev.map(t => t.id === id ? data.trip : t));
        return data.trip;
      }
      return null;
    } catch (e) {
      console.error('Error fetching trip by ID', e);
      return null;
    }
  };

  const createTrip = async (data: Partial<Trip> & { selected_cities?: string[] }): Promise<Trip | null> => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          user_id: user?.id || 'user-demo-01'
        })
      });
      const resData = await res.json();
      if (resData.trip) {
        setTrips(prev => [resData.trip, ...prev]);
        setActiveTrip(resData.trip);
        triggerConfetti();
        showToast(`Trip "${resData.trip.name}" created successfully!`, 'success');
        return resData.trip;
      }
      return null;
    } catch (e) {
      showToast('Failed to create trip', 'error');
      return null;
    }
  };

  const updateTrip = async (id: string, data: Partial<Trip>): Promise<Trip | null> => {
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.trip) {
        setTrips(prev => prev.map(t => t.id === id ? resData.trip : t));
        if (activeTrip?.id === id) setActiveTrip(resData.trip);
        showToast('Trip updated successfully', 'success');
        return resData.trip;
      }
      return null;
    } catch (e) {
      showToast('Failed to update trip', 'error');
      return null;
    }
  };

  const deleteTrip = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTrips(prev => prev.filter(t => t.id !== id));
        if (activeTrip?.id === id) {
          const remaining = trips.filter(t => t.id !== id);
          setActiveTrip(remaining.length > 0 ? remaining[0] : null);
        }
        showToast('Trip deleted', 'info');
        return true;
      }
      return false;
    } catch (e) {
      showToast('Failed to delete trip', 'error');
      return false;
    }
  };

  const addStop = async (tripId: string, cityId: string) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city_id: cityId })
      });
      const data = await res.json();
      if (data.trip) {
        setActiveTrip(data.trip);
        fetchTrips();
        showToast('City stop added to itinerary!', 'success');
      }
    } catch (e) {
      showToast('Failed to add stop', 'error');
    }
  };

  const reorderStops = async (tripId: string, orderedStopIds: string[]) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/stops/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordered_stop_ids: orderedStopIds })
      });
      const data = await res.json();
      if (data.success && activeTrip) {
        setActiveTrip({ ...activeTrip, stops: data.stops });
        showToast('Route reordered successfully', 'info');
      }
    } catch (e) {
      showToast('Failed to reorder stops', 'error');
    }
  };

  const deleteStop = async (tripId: string, stopId: string) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && activeTrip) {
        setActiveTrip({ ...activeTrip, stops: data.stops });
        showToast('Stop removed from itinerary', 'info');
      }
    } catch (e) {
      showToast('Failed to remove stop', 'error');
    }
  };

  const addActivityItem = async (tripId: string, itemData: any) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      const data = await res.json();
      if (data.item) {
        await fetchTripById(tripId);
        showToast('Activity added to schedule!', 'success');
      }
    } catch (e) {
      showToast('Failed to add activity', 'error');
    }
  };

  const deleteActivityItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/activities/${itemId}`, { method: 'DELETE' });
      if (res.ok && activeTrip) {
        await fetchTripById(activeTrip.id);
        showToast('Activity removed', 'info');
      }
    } catch (e) {
      showToast('Failed to remove activity', 'error');
    }
  };

  const addExpense = async (tripId: string, expenseData: Partial<Expense>) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
      const data = await res.json();
      if (data.expense) {
        await fetchTripById(tripId);
        showToast('Expense logged successfully', 'success');
      }
    } catch (e) {
      showToast('Failed to log expense', 'error');
    }
  };

  const deleteExpense = async (tripId: string, expenseId: string) => {
    try {
      const res = await fetch(`/api/expenses/${expenseId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchTripById(tripId);
        showToast('Expense deleted', 'info');
      }
    } catch (e) {
      showToast('Failed to delete expense', 'error');
    }
  };

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        if (data.user.home_currency) setCurrency(data.user.home_currency);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        setIsAuthOpen(false);

        // Fetch trips for this user
        const tripsRes = await fetch(`/api/trips?userId=${data.user.id}`);
        const tripsData = await tripsRes.json();
        if (tripsData.trips) {
          setTrips(tripsData.trips);
          if (tripsData.trips.length > 0) {
            setActiveTrip(tripsData.trips[0]);
          }
        }
      }
    } catch (e) {
      showToast('Login failed', 'error');
    }
  };

  const sendSignupOtp = async (email: string, name?: string): Promise<{ success: boolean; simulated_otp?: string; message: string }> => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, purpose: 'signup' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Verification code sent to ${email}`, 'success');
        return { success: true, simulated_otp: data.simulated_otp, message: data.message };
      }
      showToast(data.error || 'Failed to send verification code', 'error');
      return { success: false, message: data.error || 'Failed to send OTP' };
    } catch (e: any) {
      showToast(e.message || 'Error sending OTP', 'error');
      return { success: false, message: e.message || 'Error sending OTP' };
    }
  };

  const verifySignupOtp = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('OTP verified! Finalizing secure account...', 'success');
        return { success: true, message: data.message };
      }
      showToast(data.error || 'Invalid OTP code', 'error');
      return { success: false, message: data.error || 'Invalid OTP' };
    } catch (e: any) {
      showToast(e.message || 'Error verifying OTP', 'error');
      return { success: false, message: e.message || 'Error verifying OTP' };
    }
  };

  const firebaseSignUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      let uid = `fb_uid_${Date.now()}`;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } catch (fbErr: any) {
        console.warn('Firebase client signup fallback:', fbErr.message);
      }

      // Sync user profile to backend database
      const syncRes = await fetch('/api/auth/firebase-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          email,
          displayName: name,
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          language: 'en',
          home_currency: currency
        })
      });
      const syncData = await syncRes.json();

      if (syncData.user) {
        setUser(syncData.user);
        triggerConfetti();
        showToast(`Account verified & created for ${syncData.user.name}!`, 'success');
        setIsAuthOpen(false);

        // Fetch user trips
        const tripsRes = await fetch(`/api/trips?userId=${syncData.user.id}`);
        const tripsData = await tripsRes.json();
        if (tripsData.trips) {
          setTrips(tripsData.trips);
        }
        return { success: true };
      }

      return { success: false, error: syncData.error || 'Account synchronization failed' };
    } catch (err: any) {
      showToast(err.message || 'Failed to complete registration', 'error');
      return { success: false, error: err.message };
    }
  };

  const firebaseLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      let uid = '';
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } catch (fbErr: any) {
        console.warn('Firebase client login fallback:', fbErr.message);
      }

      // Sync/authenticate with backend
      const syncRes = await fetch('/api/auth/firebase-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email })
      });
      const syncData = await syncRes.json();

      if (syncData.user) {
        setUser(syncData.user);
        if (syncData.user.home_currency) setCurrency(syncData.user.home_currency);
        showToast(`Welcome back, ${syncData.user.name}!`, 'success');
        setIsAuthOpen(false);

        const tripsRes = await fetch(`/api/trips?userId=${syncData.user.id}`);
        const tripsData = await tripsRes.json();
        if (tripsData.trips) {
          setTrips(tripsData.trips);
          if (tripsData.trips.length > 0) setActiveTrip(tripsData.trips[0]);
        }
        return { success: true };
      }

      return { success: false, error: syncData.error || 'Login failed' };
    } catch (err: any) {
      showToast(err.message || 'Login error', 'error');
      return { success: false, error: err.message };
    }
  };

  const googleSignIn = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      let email = 'google.explorer@globetrotter.io';
      let name = 'Google Explorer';
      let photoURL = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
      let uid = `google_${Date.now()}`;

      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) {
          email = result.user.email || email;
          name = result.user.displayName || name;
          photoURL = result.user.photoURL || photoURL;
          uid = result.user.uid;
        }
      } catch (fbErr: any) {
        console.warn('Firebase Google popup fallback:', fbErr.message);
      }

      const syncRes = await fetch('/api/auth/firebase-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email, displayName: name, photoURL })
      });
      const syncData = await syncRes.json();

      if (syncData.user) {
        setUser(syncData.user);
        if (syncData.user.home_currency) setCurrency(syncData.user.home_currency);
        triggerConfetti();
        showToast(`Authenticated with Google as ${syncData.user.name}!`, 'success');
        setIsAuthOpen(false);

        const tripsRes = await fetch(`/api/trips?userId=${syncData.user.id}`);
        const tripsData = await tripsRes.json();
        if (tripsData.trips) {
          setTrips(tripsData.trips);
          if (tripsData.trips.length > 0) setActiveTrip(tripsData.trips[0]);
        }
        return { success: true };
      }

      return { success: false, error: 'Google sign in failed' };
    } catch (err: any) {
      showToast(err.message || 'Google Auth Error', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    try {
      fbSignOut(auth);
    } catch (e) {}
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?.id || 'user-demo-01', ...data })
      });
      const resData = await res.json();
      if (resData.user) {
        setUser(resData.user);
        if (resData.user.home_currency) setCurrency(resData.user.home_currency);
        showToast('Profile preferences updated', 'success');
      }
    } catch (e) {
      showToast('Failed to update profile', 'error');
    }
  };

  const forkTrip = async (shareToken: string): Promise<Trip | null> => {
    try {
      const res = await fetch(`/api/trips/public/${shareToken}/fork`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id || 'user-demo-01' })
      });
      const data = await res.json();
      if (data.trip) {
        setTrips(prev => [data.trip, ...prev]);
        setActiveTrip(data.trip);
        setActiveView('itinerary');
        triggerConfetti();
        showToast('Trip cloned into your workspace!', 'success');
        return data.trip;
      }
      return null;
    } catch (e) {
      showToast('Failed to fork trip', 'error');
      return null;
    }
  };

  useEffect(() => {
    fetchCities();
    fetchActivities();
    login('aarav@globetrotter.io');
    fetchTrips();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeView,
        setActiveView,
        trips,
        activeTrip,
        setActiveTrip,
        cities,
        activities,
        currency,
        setCurrency,
        formatCurrency,
        isCreateTripOpen,
        setIsCreateTripOpen,
        isAuthOpen,
        setIsAuthOpen,
        selectedCityForTrip,
        setSelectedCityForTrip,
        isAddActivityOpen,
        setIsAddActivityOpen,
        activityTargetStopId,
        setActivityTargetStopId,
        toasts,
        showToast,
        fetchTrips,
        fetchTripById,
        createTrip,
        updateTrip,
        deleteTrip,
        addStop,
        reorderStops,
        deleteStop,
        addActivityItem,
        deleteActivityItem,
        addExpense,
        deleteExpense,
        triggerConfetti,
        login,
        logout,
        updateUserProfile,
        forkTrip,
        sendSignupOtp,
        verifySignupOtp,
        firebaseSignUp,
        firebaseLogin,
        googleSignIn
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
