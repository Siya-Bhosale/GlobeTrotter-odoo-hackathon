'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Compass, Plus, Globe, Search, User as UserIcon, Sparkles, ChevronDown, Check, ShieldCheck, Share2 } from 'lucide-react';
import { SupportedCurrency } from '@/lib/types';

export const Navbar: React.FC = () => {
  const {
    user,
    activeView,
    setActiveView,
    currency,
    setCurrency,
    setIsCreateTripOpen,
    setIsAuthOpen,
    logout,
    login,
    activeTrip
  } = useApp();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currencies: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'AED', 'IDR'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/15 dark:border-white/10 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-2xl px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-500 p-0.5 shadow-lg shadow-teal-500/25 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
            <Compass className="w-5 h-5 text-teal-300 animate-spin-slow" />
          </div>
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
            GlobeTrotter
          </span>
          <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full">
            Pro Plan
          </span>
        </div>
      </div>

      {/* Global Search / City Quick Navigator */}
      <div className="hidden md:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search destinations, activities, trips..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 dark:bg-slate-800/50 border border-white/15 dark:border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md transition"
            onFocus={() => {
              if (activeView !== 'cities' && activeView !== 'activities') {
                setActiveView('cities');
              }
            }}
          />
        </div>
      </div>

      {/* Actions / Currency / User Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Currency Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 rounded-xl hover:bg-white/20 transition backdrop-blur-md"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{currency}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isCurrencyOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl p-1.5 z-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase px-2.5 py-1">Currency</div>
              <div className="max-h-56 overflow-y-auto">
                {currencies.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      currency === c
                        ? 'bg-teal-500/20 text-teal-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{c}</span>
                    {currency === c && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Trip CTA */}
        <button
          onClick={() => setIsCreateTripOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 via-teal-300 to-sky-400 hover:from-teal-300 hover:to-sky-300 rounded-xl shadow-lg shadow-teal-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Trip</span>
        </button>

        {/* User Account / Profile Dropdown */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 rounded-xl hover:bg-white/20 transition backdrop-blur-md"
            >
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-teal-400/50"
              />
              <span className="hidden md:inline-block text-xs font-medium text-slate-200 max-w-[100px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-teal-300 bg-teal-500/20 border border-teal-500/40 rounded-xl hover:bg-teal-500/30 transition"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {isUserMenuOpen && user && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                <div className="text-xs font-bold text-slate-100">{user.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
              </div>

              <button
                onClick={() => {
                  setActiveView('settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-white/10 rounded-xl transition flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-teal-400" />
                <span>Account & Preferences</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('admin');
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-white/10 rounded-xl transition flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Admin & Analytics</span>
              </button>

              <div className="my-1.5 border-t border-white/10 pt-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">Switch Demo User</div>
                <button
                  onClick={() => {
                    login('aarav@globetrotter.io');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded-lg transition flex items-center justify-between"
                >
                  <span>Aarav (Lead Explorer)</span>
                  {user.email === 'aarav@globetrotter.io' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
                <button
                  onClick={() => {
                    login('elena@globetrotter.io');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded-lg transition flex items-center justify-between"
                >
                  <span>Elena (Euro Traveler)</span>
                  {user.email === 'elena@globetrotter.io' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              </div>

              <div className="mt-1.5 border-t border-white/10 pt-1.5">
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
