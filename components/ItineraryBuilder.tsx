'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Share2,
  PieChart,
  Eye,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ActivityCategory } from '@/lib/types';
import { ItineraryMultiModeView } from './ItineraryMultiModeView';

export const ItineraryBuilder: React.FC = () => {
  const {
    activeTrip,
    cities,
    activities,
    formatCurrency,
    addStop,
    reorderStops,
    deleteStop,
    addActivityItem,
    deleteActivityItem,
    setActiveView,
    showToast
  } = useApp();

  const [activeMode, setActiveMode] = useState<'builder' | 'multimode'>('builder');
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  // Add Custom Activity Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [targetStopId, setTargetStopId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<ActivityCategory>('Sightseeing');
  const [customDay, setCustomDay] = useState('1');
  const [customTime, setCustomTime] = useState('10:00');
  const [customDuration, setCustomDuration] = useState('2.0');
  const [customCost, setCustomCost] = useState('25');
  const [customNotes, setCustomNotes] = useState('');
  const [selectedCatalogActId, setSelectedCatalogActId] = useState<string>('');

  // Add Stop Dropdown
  const [isAddCityDropdownOpen, setIsAddCityDropdownOpen] = useState(false);

  if (!activeTrip) {
    return (
      <div className="text-center py-20 p-8 rounded-3xl border border-white/15 bg-slate-900/40 backdrop-blur-xl animate-in fade-in">
        <MapPin className="w-12 h-12 text-teal-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">No active trip selected</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
          Please select a trip from your portfolio or create a new multi-city itinerary.
        </p>
        <button
          onClick={() => setActiveView('trips')}
          className="px-5 py-2.5 rounded-2xl bg-teal-400 text-slate-950 font-bold text-xs shadow-lg hover:bg-teal-300 transition"
        >
          Go to My Trips &rarr;
        </button>
      </div>
    );
  }

  const stops = activeTrip.stops || [];

  // Stop Reordering Handlers
  const handleMoveStop = async (currentIndex: number, direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === stops.length - 1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newStops = [...stops];
    const temp = newStops[currentIndex];
    newStops[currentIndex] = newStops[newIndex];
    newStops[newIndex] = temp;

    const orderedIds = newStops.map(s => s.id);
    await reorderStops(activeTrip.id, orderedIds);
  };

  const handleOpenAddActivity = (stopId: string) => {
    setTargetStopId(stopId);
    setSelectedCatalogActId('');
    setCustomTitle('');
    setIsCustomModalOpen(true);
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStopId) return;

    let payload: any = {
      trip_stop_id: targetStopId,
      day_number: Number(customDay) || 1,
      start_time: `${customTime}:00`,
      duration_hours: Number(customDuration) || 2.0,
      cost: Number(customCost) || 0.0,
      notes: customNotes
    };

    if (selectedCatalogActId) {
      const act = activities.find(a => a.id === selectedCatalogActId);
      payload.activity_id = selectedCatalogActId;
      payload.custom_title = act?.title || customTitle;
      payload.cost = act ? act.cost : Number(customCost);
      payload.duration_hours = act ? act.duration_hours : Number(customDuration);
    } else {
      payload.custom_title = customTitle || 'Custom Activity';
    }

    await addActivityItem(activeTrip.id, payload);
    setIsCustomModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Trip Header Bar with Multi-Mode View Switcher */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-slate-900/60 border border-white/20 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-wider border border-teal-500/30">
              Interactive Builder
            </span>
            <span className="text-xs text-slate-400">
              {format(parseISO(activeTrip.start_date), 'MMM dd')} - {format(parseISO(activeTrip.end_date), 'MMM dd, yyyy')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeTrip.name}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl line-clamp-1">
            {activeTrip.description || 'Arrange multi-city sequence and schedule daily activities.'}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="p-1 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-1">
            <button
              onClick={() => setActiveMode('builder')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMode === 'builder'
                  ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Organizer</span>
            </button>
            <button
              onClick={() => setActiveMode('multimode')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMode === 'multimode'
                  ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Multi-Mode View</span>
            </button>
          </div>

          <button
            onClick={() => setActiveView('budget')}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Budget</span>
          </button>
        </div>
      </div>

      {/* Mode 2: Multi-Mode Itinerary View (Timeline / Calendar / List / Map) */}
      {activeMode === 'multimode' ? (
        <ItineraryMultiModeView />
      ) : (
        /* Mode 1: Interactive Multi-Stop Drag/Reorder Organizer & Activity Scheduler */
        <div className="space-y-6">
          {/* Stops List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-400" />
                <span>Multi-City Stop Sequence ({stops.length} Cities)</span>
              </h2>

              {/* Add Stop Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAddCityDropdownOpen(!isAddCityDropdownOpen)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 hover:from-teal-300 hover:to-sky-300 transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add City Stop</span>
                </button>

                {isAddCityDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-40 max-h-64 overflow-y-auto">
                    <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                      Choose Global Destination
                    </div>
                    {cities.map(city => (
                      <button
                        key={city.id}
                        onClick={async () => {
                          await addStop(activeTrip.id, city.id);
                          setIsAddCityDropdownOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs hover:bg-white/10 flex items-center gap-2.5 transition text-slate-200"
                      >
                        <img
                          src={city.image_url}
                          alt={city.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-white">{city.name}</div>
                          <div className="text-[10px] text-slate-400">{city.country} • {city.cost_index}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stop Cards */}
            {stops.map((stop, sIdx) => {
              const stopItems = stop.items || [];
              const stopCost = stopItems.reduce((s, i) => s + Number(i.cost), 0);

              return (
                <div
                  key={stop.id}
                  className="rounded-3xl border border-white/15 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-lg transition"
                >
                  {/* Stop Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-black text-sm shrink-0">
                        #{sIdx + 1}
                      </div>

                      {stop.city && (
                        <img
                          src={stop.city.image_url}
                          alt={stop.city.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/20 shrink-0"
                        />
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white">
                            {stop.city?.name || 'Custom Destination'}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                            {stop.city?.country}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{stopItems.length} activities planned</span>
                          <span>•</span>
                          <span className="text-emerald-300 font-semibold">{formatCurrency(stopCost)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reorder and Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-0.5">
                        <button
                          disabled={sIdx === 0}
                          onClick={() => handleMoveStop(sIdx, 'up')}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition"
                          title="Move Stop Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={sIdx === stops.length - 1}
                          onClick={() => handleMoveStop(sIdx, 'down')}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition"
                          title="Move Stop Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenAddActivity(stop.id)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Schedule Activity</span>
                      </button>

                      <button
                        onClick={() => deleteStop(activeTrip.id, stop.id)}
                        className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/20 transition"
                        title="Remove Stop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scheduled Items for this City Stop */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {stopItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {stopItems.map(item => {
                          const category = item.activity?.category || 'Sightseeing';
                          const catColors: Record<string, string> = {
                            Sightseeing: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                            Food: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                            Adventure: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                            Culture: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                          };

                          return (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition flex items-start justify-between gap-3 group"
                            >
                              <div className="flex items-start gap-3">
                                {item.activity?.image_url && (
                                  <img
                                    src={item.activity.image_url}
                                    alt={item.custom_title || 'Activity'}
                                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                                  />
                                )}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-teal-300">
                                      Day {item.day_number}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        catColors[category] || catColors.Sightseeing
                                      }`}
                                    >
                                      {category}
                                    </span>
                                  </div>

                                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                                    {item.custom_title || item.activity?.title}
                                  </h4>

                                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <Clock className="w-3 h-3 text-teal-400" />
                                      {item.start_time.substring(0, 5)} ({item.duration_hours}h)
                                    </span>
                                    <span>•</span>
                                    <span className="font-semibold text-emerald-300">
                                      {formatCurrency(Number(item.cost))}
                                    </span>
                                  </div>

                                  {item.notes && (
                                    <p className="text-[10px] text-slate-400 italic bg-white/5 px-2 py-1 rounded-lg">
                                      "{item.notes}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => deleteActivityItem(item.id)}
                                className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-60 group-hover:opacity-100 transition"
                                title="Remove Activity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-white/15 rounded-2xl">
                        <p className="text-xs text-slate-400 mb-2">No activities scheduled yet for this city.</p>
                        <button
                          onClick={() => handleOpenAddActivity(stop.id)}
                          className="text-xs font-bold text-teal-400 hover:underline"
                        >
                          + Add Curated or Custom Activity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Activity Glass Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900/95 border border-white/20 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-slate-100 my-8">
            <button
              onClick={() => setIsCustomModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-white/10 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>Schedule Itinerary Activity</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Select a curated experience from the catalog or define custom plans.
            </p>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              {/* Pick from Curated Activities for target city */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pick from City Catalog (Optional)
                </label>
                <select
                  value={selectedCatalogActId}
                  onChange={e => {
                    const actId = e.target.value;
                    setSelectedCatalogActId(actId);
                    if (actId) {
                      const act = activities.find(a => a.id === actId);
                      if (act) {
                        setCustomTitle(act.title);
                        setCustomCost(act.cost.toString());
                        setCustomDuration(act.duration_hours.toString());
                        setCustomCategory(act.category);
                      }
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                >
                  <option value="" className="bg-slate-900">-- Custom Manual Activity --</option>
                  {activities.map(act => (
                    <option key={act.id} value={act.id} className="bg-slate-900">
                      {act.title} ({act.category} • ${act.cost})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="e.g. Sunset drinks at rooftop lounge"
                  className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                />
              </div>

              {/* Day & Start Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Day Number</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={customDay}
                    onChange={e => setCustomDay(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={e => setCustomTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>
              </div>

              {/* Duration & Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={customDuration}
                    onChange={e => setCustomDuration(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Est. Cost (USD)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={customCost}
                    onChange={e => setCustomCost(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notes & Tips</label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  placeholder="e.g. Bring camera, meet guide at metro entrance..."
                  className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 hover:from-teal-300 hover:to-sky-300 transition"
              >
                Add Activity to Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
