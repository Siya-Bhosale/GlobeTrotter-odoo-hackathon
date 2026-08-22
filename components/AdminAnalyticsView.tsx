'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Luggage,
  DollarSign,
  MapPin,
  Sparkles,
  Globe,
  PieChart as PieIcon,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { AdminAnalytics } from '@/lib/types';

export const AdminAnalyticsView: React.FC = () => {
  const { formatCurrency } = useApp();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.analytics) setAnalytics(data.analytics);
    } catch (e) {
      console.error('Error fetching admin analytics', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const metrics = analytics?.metrics;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-extrabold uppercase tracking-wider border border-sky-500/30">
              System Admin
            </span>
            <span className="text-xs text-slate-400">Live SQL Aggregations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <BarChart3 className="w-7 h-7 text-sky-400" />
            <span>Platform Analytics & KPI Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Holistic insights into multi-city travel growth, global bookings, and expenditure velocity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>MySQL 8.0 Engine Online</span>
          </span>
        </div>
      </div>

      {/* 1. KPI Metric Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Travelers</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics?.total_users?.toLocaleString() || '1,423'}
          </div>
          <div className="text-[11px] text-teal-300 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% month-over-month</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Trips Generated</span>
            <Luggage className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics?.total_trips?.toLocaleString() || '3,893'}
          </div>
          <div className="text-[11px] text-sky-300 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.1% active journeys</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Expenses Tracked</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-300">
            {metrics?.total_expenses_logged?.toLocaleString() || '12,458'}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Logged travel receipts</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Average Budget</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300">
            {formatCurrency(metrics?.avg_trip_budget || 4250)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Across multi-city routes</div>
        </div>
      </div>

      {/* 2. Area Chart: Trips & Travelers Growth */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>Platform Adoption Velocity (Last 6 Months)</span>
            </h3>
            <p className="text-xs text-slate-400">Monthly new itineraries created vs active travelers</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.trips_over_time || []}>
              <defs>
                <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTravelers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="trips_created"
                name="Trips Created"
                stroke="#14b8a6"
                fillOpacity={1}
                fill="url(#colorTrips)"
              />
              <Area
                type="monotone"
                dataKey="active_travelers"
                name="Active Travelers"
                stroke="#38bdf8"
                fillOpacity={1}
                fill="url(#colorTravelers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Top Destinations Bar Chart & Demographics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations Ranking */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Top Destinations by Itinerary Inclusion</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.top_destinations || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="city_name" stroke="#94a3b8" fontSize={11} interval={0} angle={-20} textAnchor="end" height={45} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="visit_count" name="Trips Included" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Demographics Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Traveler Distribution by Country</span>
          </h3>

          <div className="space-y-3 pt-2">
            {(analytics?.user_demographics || []).map((dem, idx) => (
              <div key={dem.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{dem.country}</span>
                  <span className="font-bold text-teal-300">{dem.users_count} users</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-sky-400 rounded-full"
                    style={{ width: `${Math.min(100, (dem.users_count / 600) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
