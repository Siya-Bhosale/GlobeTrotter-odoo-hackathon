'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  Compass,
  Sparkles,
  PieChart,
  Calendar,
  Share2,
  BarChart3,
  Settings,
  Plus,
  PlaneTakeoff,
  Luggage
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    trips,
    activeTrip,
    setActiveTrip,
    setIsCreateTripOpen
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trips', label: 'My Trips', icon: Luggage, count: trips.length },
    { id: 'itinerary', label: 'Itinerary Builder', icon: PlaneTakeoff },
    { id: 'cities', label: 'Explore Cities', icon: MapPin },
    { id: 'activities', label: 'Activity Catalog', icon: Sparkles },
    { id: 'budget', label: 'Budget & Cost', icon: PieChart },
    { id: 'calendar', label: 'Trip Calendar', icon: CalendarDays },
    { id: 'public', label: 'Shared / Public', icon: Share2 },
    { id: 'admin', label: 'Analytics & KPIs', icon: BarChart3 },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/15 dark:border-white/10 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-2xl p-4 shrink-0 h-[calc(100vh-65px)] sticky top-[65px] justify-between">
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Quick Trip Switcher */}
        <div className="p-3 rounded-2xl bg-white/10 dark:bg-slate-800/40 border border-white/15 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Active Trip</span>
            <button
              onClick={() => setIsCreateTripOpen(true)}
              className="text-teal-400 hover:text-teal-300 transition"
              title="Add New Trip"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {trips.length > 0 ? (
            <div className="space-y-1">
              <select
                value={activeTrip?.id || ''}
                onChange={e => {
                  const t = trips.find(item => item.id === e.target.value);
                  if (t) setActiveTrip(t);
                }}
                className="w-full bg-slate-900/80 border border-white/15 text-xs text-slate-100 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                {trips.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-100">
                    {t.name}
                  </option>
                ))}
              </select>

              {activeTrip && (
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="truncate max-w-[120px] font-medium text-teal-300">
                    {activeTrip.stops?.length || 0} stops
                  </span>
                  <button
                    onClick={() => setActiveView('itinerary')}
                    className="text-teal-400 hover:underline font-semibold"
                  >
                    View Plan &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-1">No trips yet. Create your first!</div>
          )}
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            Menu Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/25 to-sky-500/20 text-teal-300 border border-teal-500/30 shadow-lg shadow-teal-500/10'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-teal-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-teal-400/20 text-teal-200'
                        : 'bg-white/10 text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-900/40 via-sky-900/30 to-indigo-900/40 border border-teal-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          <span className="text-xs font-bold text-teal-200">AI Trip Optimizer</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          Smart routing, cost optimization & real-time travel forecasting active.
        </p>
      </div>
    </aside>
  );
};
