'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  startOfWeek,
  endOfWeek
} from 'date-fns';

export const TripCalendarView: React.FC = () => {
  const { trips, setActiveTrip, setActiveView } = useApp();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 8, 1)); // Sept 2026 for demo alignment
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(2026, 8, 10));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Find trips active on a given day
  const getTripsForDay = (day: Date) => {
    return trips.filter(trip => {
      try {
        const start = parseISO(trip.start_date);
        const end = parseISO(trip.end_date);
        return isWithinInterval(day, { start, end });
      } catch (e) {
        return false;
      }
    });
  };

  const selectedDayTrips = getTripsForDay(selectedDay);

  const TRIP_COLORS = [
    'bg-teal-500/80 text-slate-950 border-teal-400',
    'bg-sky-500/80 text-slate-950 border-sky-400',
    'bg-amber-500/80 text-slate-950 border-amber-400',
    'bg-purple-500/80 text-slate-950 border-purple-400',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-teal-400" />
            <span>Master Trip Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual month-level itinerary matrix with active departure spans.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900/80 border border-white/15 p-1 rounded-2xl backdrop-blur-xl">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white px-3">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid & Selected Day Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Grid */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-3">
          {/* Day Names */}
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map(day => {
              const isSelected = isSameDay(day, selectedDay);
              const isCurrent = isSameMonth(day, currentMonth);
              const dayTrips = getTripsForDay(day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[80px] sm:min-h-[95px] p-1.5 sm:p-2 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-400 ring-2 ring-teal-400/40 shadow-lg'
                      : isCurrent
                      ? 'bg-white/5 border-white/10 hover:border-white/20'
                      : 'bg-white/[0.02] border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-teal-300'
                          : isCurrent
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayTrips.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 shadow-sm shadow-teal-400 animate-pulse" />
                    )}
                  </div>

                  {/* Trip Ribbons */}
                  <div className="space-y-1 my-1">
                    {dayTrips.slice(0, 2).map((t, idx) => (
                      <div
                        key={t.id}
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md truncate ${
                          TRIP_COLORS[idx % TRIP_COLORS.length]
                        }`}
                      >
                        {t.name}
                      </div>
                    ))}
                    {dayTrips.length > 2 && (
                      <div className="text-[8px] text-slate-400 font-bold px-1">
                        +{dayTrips.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Drawer */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Daily Travel Ledger</h3>
                <p className="text-xs text-teal-300 font-medium">
                  {format(selectedDay, 'EEEE, MMMM dd, yyyy')}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                {selectedDayTrips.length} Trips
              </span>
            </div>

            {selectedDayTrips.length > 0 ? (
              <div className="space-y-4">
                {selectedDayTrips.map(trip => (
                  <div
                    key={trip.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{trip.name}</h4>
                        <div className="text-[11px] text-slate-400">
                          {format(parseISO(trip.start_date), 'MMM dd')} - {format(parseISO(trip.end_date), 'MMM dd')}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                        Active
                      </span>
                    </div>

                    {/* Stops on that day */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Scheduled Destinations:
                      </div>
                      {(trip.stops || []).map(s => (
                        <div key={s.id} className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{s.city?.name} ({s.items?.length || 0} activities)</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setActiveTrip(trip);
                        setActiveView('itinerary');
                      }}
                      className="w-full py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition flex items-center justify-center gap-1"
                    >
                      <span>Open Itinerary Builder</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto text-slate-600" />
                <p>No travel departures scheduled on this day.</p>
                <button
                  onClick={() => setActiveView('explore')}
                  className="text-teal-400 font-semibold hover:underline"
                >
                  Explore new destinations &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
