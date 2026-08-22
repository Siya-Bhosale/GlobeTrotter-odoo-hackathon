'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Settings,
  Globe,
  DollarSign,
  Shield,
  Sparkles,
  Database,
  Save,
  Check,
  Heart,
  Server
} from 'lucide-react';
import { SupportedCurrency } from '@/lib/types';

export const UserProfileSettings: React.FC = () => {
  const {
    user,
    currency,
    setCurrency,
    updateUserProfile,
    formatCurrency,
    cities,
    showToast
  } = useApp();

  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const [language, setLanguage] = useState(user?.language || 'en');
  const [testAmount, setTestAmount] = useState('1000');

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name,
      avatar_url: avatarUrl,
      language,
      home_currency: currency
    });
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-teal-400" />
          <span>Account & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your profile, preferred currency, language, and relational database connections.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" />
            <span>Profile Identity</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src={avatarUrl}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-teal-400/50 shadow-lg"
            />

            <div className="space-y-2 flex-1 w-full">
              <div className="text-xs font-semibold text-slate-300">Choose Avatar Preset</div>
              <div className="flex items-center gap-2.5">
                {avatarOptions.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="avatar option"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition ${
                      avatarUrl === url
                        ? 'border-teal-400 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'aarav@globetrotter.io'}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Currency & Localization Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Localization & Live Currency Conversion</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as SupportedCurrency)}
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              >
                <option value="USD" className="bg-slate-900">USD ($) - US Dollar</option>
                <option value="EUR" className="bg-slate-900">EUR (€) - Euro</option>
                <option value="GBP" className="bg-slate-900">GBP (£) - British Pound</option>
                <option value="JPY" className="bg-slate-900">JPY (¥) - Japanese Yen</option>
                <option value="INR" className="bg-slate-900">INR (₹) - Indian Rupee</option>
                <option value="AUD" className="bg-slate-900">AUD (A$) - Australian Dollar</option>
                <option value="CAD" className="bg-slate-900">CAD (C$) - Canadian Dollar</option>
                <option value="CHF" className="bg-slate-900">CHF - Swiss Franc</option>
                <option value="AED" className="bg-slate-900">AED - UAE Dirham</option>
                <option value="IDR" className="bg-slate-900">IDR (Rp) - Indonesian Rupiah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              >
                <option value="en" className="bg-slate-900">English (United States)</option>
                <option value="fr" className="bg-slate-900">Français (French)</option>
                <option value="de" className="bg-slate-900">Deutsch (German)</option>
                <option value="ja" className="bg-slate-900">日本語 (Japanese)</option>
                <option value="es" className="bg-slate-900">Español (Spanish)</option>
              </select>
            </div>
          </div>

          {/* Live Converter Preview */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <span>Live Test Conversion: </span>
              <strong className="text-white">$1,000 USD</strong> ={' '}
              <strong className="text-teal-300 text-sm font-black">{formatCurrency(1000)}</strong>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Real-time exchange rate matrix applied
            </div>
          </div>
        </div>

        {/* Database Connection Architecture Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-400" />
              <span>Relational Database Engine (MySQL 8.0+)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
              <Server className="w-3 h-3" />
              <span>Active Dual-Mode Adapter</span>
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            GlobeTrotter comes loaded with complete MySQL 8.0+ relational DDL scripts (<code className="text-teal-300">database/schema.sql</code> and <code className="text-teal-300">database/seed.sql</code>). If environment variables <code className="text-sky-300">DATABASE_HOST</code> and <code className="text-sky-300">DATABASE_USER</code> are set, the platform directly executes connection-pooled relational queries with <code className="text-teal-300">mysql2/promise</code>.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 hover:from-teal-300 hover:to-sky-300 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  );
};
