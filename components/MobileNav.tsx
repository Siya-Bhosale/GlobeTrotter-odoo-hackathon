'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Luggage,
  PlaneTakeoff,
  MapPin,
  PieChart,
  CalendarDays,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Settings,
  Share2,
  Plus
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, setIsCreateTripOpen } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'trips', label: 'Trips', icon: Luggage },
    { id: 'itinerary', label: 'Plan', icon: PlaneTakeoff },
    { id: 'cities', label: 'Explore', icon: MapPin },
    { id: 'budget', label: 'Budget', icon: PieChart },
  ];

  const moreTabs = [
    { id: 'activities', label: 'Activity Catalog', icon: Sparkles },
    { id: 'calendar', label: 'Trip Calendar', icon: CalendarDays },
    { id: 'public', label: 'Shared / Public', icon: Share2 },
    { id: 'admin', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'settings', label: 'User Settings', icon: Settings },
  ];

  return (
    <>
      {/* Drawer Overlay for Extra Menu Items */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl lg:hidden flex flex-col justify-end p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900/95 border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Menu className="w-4 h-4 text-teal-400" />
                <span>More Features & Tools</span>
              </h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-full bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveView(tab.id);
                      setIsMoreOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold transition text-left ${
                      isActive
                        ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsCreateTripOpen(true);
                setIsMoreOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Trip</span>
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Glass Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/15 bg-slate-950/80 backdrop-blur-2xl px-2 py-2 flex items-center justify-around">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition ${
                isActive
                  ? 'text-teal-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-teal-500/20 text-teal-300' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition"
        >
          <div className="p-1 rounded-lg hover:bg-white/10">
            <Menu className="w-4 h-4" />
          </div>
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
