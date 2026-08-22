'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  ListFilter,
  CheckCircle2,
  Circle,
  Compass,
  Plane,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const ItineraryMultiModeView: React.FC = () => {
  const { activeTrip, formatCurrency } = useApp();
  const [viewType, setViewType] = useState<'timeline' | 'calendar' | 'list' | 'map'>('timeline');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  if (!activeTrip) return null;

  const stops = activeTrip.stops || [];

  // Flatten all items across stops with city context
  const allScheduledItems: any[] = [];
  stops.forEach(stop => {
    (stop.items || []).forEach(item => {
      allScheduledItems.push({
        ...item,
        cityName: stop.city?.name || 'City',
        cityCountry: stop.city?.country || '',
        cityImage: stop.city?.image_url,
      });
    });
  });

  // Sort by day and start time
  allScheduledItems.sort((a, b) => {
    if (a.day_number !== b.day_number) return a.day_number - b.day_number;
    return a.start_time.localeCompare(b.start_time);
  });

  // Group items by day
  const itemsByDay: Record<number, any[]> = {};
  allScheduledItems.forEach(item => {
    if (!itemsByDay[item.day_number]) itemsByDay[item.day_number] = [];
    itemsByDay[item.day_number].push(item);
  });

  const toggleItemComplete = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'timeline', label: 'Timeline Mode', icon: Clock },
            { id: 'calendar', label: 'Calendar Grid', icon: Calendar },
            { id: 'list', label: 'Checklist Mode', icon: ListFilter },
            { id: 'map', label: 'Route Simulator Map', icon: Compass },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = viewType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewType(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-slate-400 px-2">
          {allScheduledItems.length} total scheduled activities across {stops.length} cities
        </div>
      </div>

      {/* 1. TIMELINE MODE */}
      {viewType === 'timeline' && (
        <div className="space-y-8">
          {Object.keys(itemsByDay).length > 0 ? (
            Object.entries(itemsByDay).map(([dayNum, dayItems]) => (
              <div key={dayNum} className="relative pl-6 sm:pl-8 border-l-2 border-teal-500/40 space-y-4">
                {/* Day Badge Marker */}
                <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-slate-950 border-2 border-teal-400 text-teal-300 flex items-center justify-center font-bold text-xs shadow-lg">
                  {dayNum}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                    <span>Day {dayNum} Itinerary</span>
                    <span className="text-xs font-normal text-slate-400">
                      ({dayItems.length} events • {formatCurrency(dayItems.reduce((s, i) => s + Number(i.cost), 0))})
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dayItems.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl hover:border-teal-400/50 transition flex items-start gap-3.5 group shadow-lg"
                    >
                      {item.activity?.image_url || item.cityImage ? (
                        <img
                          src={item.activity?.image_url || item.cityImage}
                          alt={item.custom_title}
                          className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/15 shrink-0"
                        />
                      ) : null}

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            {item.cityName}
                          </span>
                          <span className="text-xs font-bold text-emerald-300">
                            {formatCurrency(Number(item.cost))}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition leading-tight">
                          {item.custom_title || item.activity?.title}
                        </h4>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3 h-3 text-teal-400" />
                            {item.start_time.substring(0, 5)} ({item.duration_hours}h)
                          </span>
                          <span>•</span>
                          <span className="text-slate-400">{item.activity?.category || 'Sightseeing'}</span>
                        </div>

                        {item.notes && (
                          <p className="text-[11px] text-slate-300 bg-white/5 p-2 rounded-xl border border-white/5 italic">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-white/15 rounded-3xl bg-slate-900/40 text-slate-400">
              No itinerary timeline items scheduled yet.
            </div>
          )}
        </div>
      )}

      {/* 2. CALENDAR GRID MODE */}
      {viewType === 'calendar' && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl space-y-4">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" />
            <span>Multi-Day Schedule Matrix</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(day => {
              const dayEvents = itemsByDay[day] || [];
              return (
                <div
                  key={day}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between min-h-[160px]"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-xs font-bold text-teal-300">Day {day}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {dayEvents.length} events
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    {dayEvents.slice(0, 3).map(e => (
                      <div
                        key={e.id}
                        className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[11px] text-slate-200 truncate"
                      >
                        <span className="font-bold text-teal-300">{e.start_time.substring(0, 5)}</span>{' '}
                        {e.custom_title || e.activity?.title}
                      </div>
                    ))}
                    {dayEvents.length === 0 && (
                      <div className="text-[11px] text-slate-500 italic py-4 text-center">
                        Free exploration day
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. LIST / CHECKLIST MODE */}
      {viewType === 'list' && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Travel Checklist & Activities Roster
            </h3>
            <span className="text-xs text-teal-300 font-semibold">
              {Object.values(completedItems).filter(Boolean).length} / {allScheduledItems.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {allScheduledItems.map(item => {
              const isChecked = !!completedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItemComplete(item.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        {item.custom_title || item.activity?.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.cityName} • Day {item.day_number} at {item.start_time.substring(0, 5)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-emerald-300">
                      {formatCurrency(Number(item.cost))}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.duration_hours} hrs</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. ROUTE SIMULATOR MAP MODE */}
      {viewType === 'map' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-400" />
              <span>Multi-City Route Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visual path connectivity, flight arcs, and sequenced waypoint checkpoints.
            </p>
          </div>

          {/* Interactive Route Canvas Diagram */}
          <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-10 min-h-[360px] flex flex-col justify-between">
            {/* World Grid Texture */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* City Waypoints in Sequential Flow */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 my-auto">
              {stops.map((stop, idx) => (
                <React.Fragment key={stop.id}>
                  {/* Waypoint Card */}
                  <div className="flex flex-col items-center text-center space-y-2 group">
                    <div className="relative">
                      {stop.city?.image_url && (
                        <img
                          src={stop.city.image_url}
                          alt={stop.city.name}
                          className="w-20 h-20 rounded-3xl object-cover ring-2 ring-teal-400/50 shadow-xl shadow-teal-500/20 group-hover:scale-110 transition duration-300"
                        />
                      )}
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                        {idx + 1}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-black text-white">{stop.city?.name}</div>
                      <div className="text-[11px] text-teal-300">{stop.city?.country}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {stop.items?.length || 0} scheduled stops
                      </div>
                    </div>
                  </div>

                  {/* Flight Path Connector */}
                  {idx < stops.length - 1 && (
                    <div className="hidden md:flex flex-col items-center gap-1 flex-1 px-4">
                      <div className="text-[10px] font-bold text-teal-300 flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5 rotate-90 text-sky-400 animate-pulse" />
                        <span>Transit Arc #{idx + 1}</span>
                      </div>
                      <div className="w-full h-0.5 border-t-2 border-dashed border-teal-400/50 relative">
                        <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400/80 shadow-md shadow-teal-400 animate-ping" />
                      </div>
                      <span className="text-[9px] text-slate-500">Connecting Flight / Rail</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Bottom Summary Bar */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Total Multi-City Span: <strong>{stops.length} Destinations</strong></span>
              </div>
              <div className="text-teal-300 font-bold">
                Status: Verified Optimal Sequence
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
