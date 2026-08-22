'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Calendar,
  DollarSign,
  MapPin,
  ArrowRight,
  PlaneTakeoff,
  Clock,
  Compass,
  PieChart,
  Plus,
  Share2,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';

export const DashboardView: React.FC = () => {
  const {
    user,
    trips,
    activeTrip,
    setActiveTrip,
    setActiveView,
    cities,
    formatCurrency,
    setIsCreateTripOpen,
    setSelectedCityForTrip
  } = useApp();

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
      ? 'Good afternoon'
      : 'Good evening';

  const upcomingTrip = trips[0] || activeTrip;

  // Calculate days until trip
  let daysUntil = 0;
  let tripDurationDays = 0;
  if (upcomingTrip) {
    try {
      const start = parseISO(upcomingTrip.start_date);
      const end = parseISO(upcomingTrip.end_date);
      const now = new Date();
      daysUntil = Math.max(0, differenceInDays(start, now));
      tripDurationDays = Math.max(1, differenceInDays(end, start) + 1);
    } catch (e) {
      daysUntil = 14;
      tripDurationDays = 14;
    }
  }

  const totalSpent = (upcomingTrip?.expenses || []).reduce((s, e) => s + Number(e.amount), 0);
  const budgetLimit = upcomingTrip?.total_budget || 0;
  const budgetPercent = budgetLimit > 0 ? Math.min(100, Math.round((totalSpent / budgetLimit) * 100)) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Personalized Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-teal-900/50 via-slate-900/60 to-indigo-950/60 border border-white/20 backdrop-blur-2xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-City Travel Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {greeting}, {user?.name || 'Explorer'}! ✈️
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              You have <span className="text-teal-300 font-semibold">{trips.length} active adventures</span> planned. Your upcoming trip to{' '}
              <span className="text-sky-300 font-semibold">{upcomingTrip?.stops?.[0]?.city?.name || 'Europe'}</span> begins in{' '}
              <span className="text-amber-300 font-bold">{daysUntil} days</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateTripOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-300 to-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-teal-500/20 hover:from-teal-300 hover:to-sky-300 active:scale-95 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Trip</span>
            </button>
            <button
              onClick={() => setActiveView('cities')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 font-semibold text-xs sm:text-sm backdrop-blur-md transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Explore Cities</span>
            </button>
          </div>
        </div>

        {/* Scenic Background Tint Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-gradient-to-l from-teal-400 via-sky-500 to-transparent blur-3xl" />
      </div>

      {/* 2. Upcoming Trip Progress Hero Card */}
      {upcomingTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900/50 backdrop-blur-2xl shadow-xl flex flex-col justify-between group">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={upcomingTrip.cover_image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
                alt={upcomingTrip.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-500/80 backdrop-blur-md text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
                  Next Departure
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>In {daysUntil} Days</span>
                  </span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {upcomingTrip.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 mt-1">
                  {upcomingTrip.description || 'Multi-city travel route and curated itinerary'}
                </p>
              </div>
            </div>

            {/* Route Stops Ribbon */}
            <div className="p-5 sm:p-6 space-y-4 bg-slate-900/40">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-teal-300 font-bold uppercase tracking-wider text-[11px]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Route Sequence ({upcomingTrip.stops?.length || 0} Cities)</span>
                </span>
                <span>
                  {format(parseISO(upcomingTrip.start_date), 'MMM dd')} - {format(parseISO(upcomingTrip.end_date), 'MMM dd, yyyy')} ({tripDurationDays} Days)
                </span>
              </div>

              {/* Stop Badges Sequence */}
              <div className="flex flex-wrap items-center gap-2">
                {(upcomingTrip.stops || []).map((stop, idx) => (
                  <React.Fragment key={stop.id}>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md">
                      <div className="w-5 h-5 rounded-full bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-100">
                        {stop.city?.name || 'Destination'}
                      </span>
                    </div>
                    {idx < (upcomingTrip.stops?.length || 0) - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setActiveTrip(upcomingTrip);
                    setActiveView('itinerary');
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 hover:bg-teal-300 transition flex items-center gap-1.5"
                >
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                  <span>Open Itinerary Builder</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTrip(upcomingTrip);
                    setActiveView('budget');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Budget Breakdown</span>
                </button>
                {upcomingTrip.share_token && (
                  <button
                    onClick={() => {
                      setActiveTrip(upcomingTrip);
                      setActiveView('public');
                    }}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs transition flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Public View</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Financial Progress Card */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Financial Status Tile */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/20 backdrop-blur-2xl shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Budget Health
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    {budgetPercent}% Allocated
                  </span>
                </div>

                <div className="text-2xl font-black text-white">
                  {formatCurrency(totalSpent)}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    / {formatCurrency(budgetLimit)}
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetPercent > 90
                        ? 'bg-rose-500'
                        : budgetPercent > 70
                        ? 'bg-amber-400'
                        : 'bg-teal-400'
                    }`}
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Remaining:</span>
                    <div className="font-bold text-teal-300">
                      {formatCurrency(Math.max(0, budgetLimit - totalSpent))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Daily Target:</span>
                    <div className="font-bold text-sky-300">
                      {formatCurrency(budgetLimit / tripDurationDays)}/day
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <button
                  onClick={() => {
                    setActiveTrip(upcomingTrip);
                    setActiveView('budget');
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-slate-200 transition text-center"
                >
                  Manage Trip Expenses &rarr;
                </button>
              </div>
            </div>

            {/* Quick Trip Stats Tile */}
            <div className="p-5 rounded-3xl bg-slate-900/50 border border-white/20 backdrop-blur-2xl shadow-xl space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Quick Activity Summary
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg font-black text-teal-300">
                    {(upcomingTrip.stops || []).reduce((acc, s) => acc + (s.items?.length || 0), 0)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">Events</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg font-black text-sky-300">
                    {upcomingTrip.stops?.length || 0}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">Cities</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg font-black text-amber-300">{tripDurationDays}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Recent Trips Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Your Travel Portfolio</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {trips.length} Trips
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Manage ongoing routes, upcoming itineraries, and past memoirs.
            </p>
          </div>
          <button
            onClick={() => setActiveView('trips')}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 transition flex items-center gap-1"
          >
            <span>View All Trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trips.map(trip => (
            <div
              key={trip.id}
              onClick={() => {
                setActiveTrip(trip);
                setActiveView('itinerary');
              }}
              className="group cursor-pointer rounded-3xl overflow-hidden border border-white/15 bg-slate-900/40 backdrop-blur-xl hover:border-teal-400/50 hover:shadow-2xl hover:shadow-teal-500/10 transition duration-300 flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={trip.cover_image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'}
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-teal-300 border border-teal-500/30">
                    {formatCurrency(trip.total_budget)}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-teal-300 transition">
                    {trip.name}
                  </h3>
                  <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3 h-3 text-teal-400" />
                    <span>
                      {format(parseISO(trip.start_date), 'MMM dd')} - {format(parseISO(trip.end_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{trip.stops?.length || 0} Destinations</span>
                </div>
                <span className="font-semibold text-teal-400 group-hover:translate-x-0.5 transition">
                  Edit Plan &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Curated Global Destinations Gallery */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-400" />
              <span>Recommended Destinations</span>
            </h2>
            <p className="text-xs text-slate-400">
              Curated world capitals and scenic retreats ready for your next multi-city route.
            </p>
          </div>
          <button
            onClick={() => setActiveView('cities')}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 transition flex items-center gap-1"
          >
            <span>Explore All Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cities.slice(0, 4).map(city => (
            <div
              key={city.id}
              className="group relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900/40 backdrop-blur-xl hover:border-teal-400 transition flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={city.image_url}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/10">
                    ★ {city.popularity_score}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h4 className="text-sm font-bold text-white leading-tight">{city.name}</h4>
                  <div className="text-[11px] text-slate-300">{city.country} • {city.cost_index}</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/80">
                <button
                  onClick={() => {
                    setSelectedCityForTrip(city);
                    setIsCreateTripOpen(true);
                  }}
                  className="w-full py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-semibold transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Trip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
