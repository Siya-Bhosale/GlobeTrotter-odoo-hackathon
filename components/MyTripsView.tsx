'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Luggage,
  Calendar,
  DollarSign,
  MapPin,
  Plus,
  Search,
  Share2,
  Trash2,
  Edit,
  PieChart,
  Copy,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';
import { parseISO, isFuture, isPast, isWithinInterval, format } from 'date-fns';

export const MyTripsView: React.FC = () => {
  const {
    trips,
    activeTrip,
    setActiveTrip,
    setActiveView,
    setIsCreateTripOpen,
    deleteTrip,
    formatCurrency,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();

  // Categorize trips
  const filteredTrips = trips.filter(trip => {
    // Search query filter
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (trip.stops || []).some(s => s.city?.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;

    try {
      const start = parseISO(trip.start_date);
      const end = parseISO(trip.end_date);

      if (activeTab === 'upcoming') {
        return isFuture(start);
      }
      if (activeTab === 'completed') {
        return isPast(end);
      }
      if (activeTab === 'ongoing') {
        return isWithinInterval(now, { start, end });
      }
    } catch (e) {
      return true;
    }

    return true;
  });

  const handleShareLink = (trip: any) => {
    const url = `${window.location.origin}/?view=public&token=${trip.share_token || 'demo'}`;
    navigator.clipboard.writeText(url);
    showToast('Public itinerary share link copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Luggage className="w-7 h-7 text-teal-400" />
            <span>My Trips Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize multi-city routes, schedule activities, and monitor travel expenses.
          </p>
        </div>

        <button
          onClick={() => setIsCreateTripOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-300 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:from-teal-300 hover:to-sky-300 active:scale-95 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Trip</span>
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Trips', count: trips.length },
            { id: 'upcoming', label: 'Upcoming', count: trips.filter(t => isFuture(parseISO(t.start_date))).length },
            { id: 'ongoing', label: 'Ongoing', count: trips.filter(t => isWithinInterval(now, { start: parseISO(t.start_date), end: parseISO(t.end_date) })).length },
            { id: 'completed', label: 'Completed', count: trips.filter(t => isPast(parseISO(t.end_date))).length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search trip or city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
          />
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => {
            const spent = (trip.expenses || []).reduce((s, e) => s + Number(e.amount), 0);
            const budget = Number(trip.total_budget);
            const percent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

            return (
              <div
                key={trip.id}
                className="group rounded-3xl overflow-hidden border border-white/15 bg-slate-900/50 backdrop-blur-2xl shadow-xl hover:border-teal-400/50 transition duration-300 flex flex-col justify-between"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.cover_image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-slate-200 border border-white/15 flex items-center gap-1">
                      {trip.is_public ? <Globe className="w-3 h-3 text-teal-400" /> : <Lock className="w-3 h-3 text-slate-400" />}
                      <span>{trip.is_public ? 'Public' : 'Private'}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-white/15">
                      {formatCurrency(budget)}
                    </span>
                  </div>

                  {/* Title & Dates */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-teal-300 transition">
                      {trip.name}
                    </h3>
                    <div className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3 h-3 text-teal-400" />
                      <span>
                        {format(parseISO(trip.start_date), 'MMM dd')} - {format(parseISO(trip.end_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 bg-slate-900/40">
                  {/* Stops Pills */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                      <span>Destinations</span>
                      <span className="text-teal-300">{trip.stops?.length || 0} Cities</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(trip.stops || []).map((stop, sIdx) => (
                        <span
                          key={stop.id}
                          className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 text-[11px] font-medium text-slate-200"
                        >
                          {stop.city?.name || `Stop ${sIdx + 1}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Budget Gauge */}
                  <div className="space-y-1 pt-1 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Spent: {formatCurrency(spent)}</span>
                      <span className="font-bold text-slate-300">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${percent > 90 ? 'bg-rose-500' : 'bg-teal-400'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setActiveTrip(trip);
                          setActiveView('itinerary');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Builder</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTrip(trip);
                          setActiveView('budget');
                        }}
                        className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 transition"
                        title="Budget & Expenses"
                      >
                        <PieChart className="w-4 h-4" />
                      </button>

                      {trip.is_public && (
                        <button
                          onClick={() => handleShareLink(trip)}
                          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-300 transition"
                          title="Copy Share Link"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/15 transition"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl border border-white/15 bg-slate-900/40 backdrop-blur-xl">
          <Luggage className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No journeys found in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Get started by initializing your first multi-destination travel route.
          </p>
          <button
            onClick={() => setIsCreateTripOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:bg-teal-300 transition"
          >
            Create New Trip &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
