'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Search,
  Clock,
  DollarSign,
  Star,
  Plus,
  Compass,
  Utensils,
  Mountain,
  Landmark,
  Check,
  CheckCircle2
} from 'lucide-react';
import { Activity, ActivityCategory } from '@/lib/types';

export const ActivitySearchCatalog: React.FC = () => {
  const {
    activities,
    cities,
    activeTrip,
    addActivityItem,
    formatCurrency,
    showToast,
    setActiveView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCityId, setSelectedCityId] = useState<string>('All');
  const [maxCost, setMaxCost] = useState<number>(150);

  // Target Stop assignment state
  const [activeModalAct, setActiveModalAct] = useState<Activity | null>(null);
  const [targetStopId, setTargetStopId] = useState<string>('');
  const [targetDay, setTargetDay] = useState('1');
  const [targetTime, setTargetTime] = useState('10:00');

  const categories: { label: string; value: string; icon: any }[] = [
    { label: 'All Activities', value: 'All', icon: Sparkles },
    { label: 'Sightseeing', value: 'Sightseeing', icon: Compass },
    { label: 'Food & Culinary', value: 'Food', icon: Utensils },
    { label: 'Adventure', value: 'Adventure', icon: Mountain },
    { label: 'Culture & Arts', value: 'Culture', icon: Landmark },
  ];

  const filteredActivities = activities.filter(act => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.city_name && act.city_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || act.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesCity = selectedCityId === 'All' || act.city_id === selectedCityId;
    const matchesCost = act.cost <= maxCost;

    return matchesSearch && matchesCategory && matchesCity && matchesCost;
  });

  const handleOpenAssign = (act: Activity) => {
    if (!activeTrip || !activeTrip.stops || activeTrip.stops.length === 0) {
      showToast('Please create or select an active trip with destination stops first.', 'warning');
      return;
    }
    setActiveModalAct(act);
    // Default to first matching city stop if available
    const matchingStop = activeTrip.stops.find(s => s.city_id === act.city_id) || activeTrip.stops[0];
    setTargetStopId(matchingStop.id);
  };

  const handleAssignToTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAct || !targetStopId || !activeTrip) return;

    await addActivityItem(activeTrip.id, {
      trip_stop_id: targetStopId,
      activity_id: activeModalAct.id,
      custom_title: activeModalAct.title,
      day_number: Number(targetDay) || 1,
      start_time: `${targetTime}:00`,
      duration_hours: activeModalAct.duration_hours,
      cost: activeModalAct.cost,
      notes: `Curated from catalog: ${activeModalAct.category}`
    });

    setActiveModalAct(null);
    setActiveView('itinerary');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-teal-400" />
            <span>Curated Activity Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified culinary walks, mountain summits, historic landmarks, and desert expeditions.
          </p>
        </div>

        {activeTrip && (
          <div className="px-3.5 py-1.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-200 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto">
            <span>Scheduling for:</span>
            <strong className="text-white">{activeTrip.name}</strong>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl space-y-4 shadow-lg">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search, City & Price Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
            />
          </div>

          <div>
            <select
              value={selectedCityId}
              onChange={e => setSelectedCityId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
            >
              <option value="All">All Cities & Regions</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
              Max: ${maxCost}
            </span>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={maxCost}
              onChange={e => setMaxCost(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map(act => {
          const categoryColors: Record<string, string> = {
            Sightseeing: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
            Food: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            Adventure: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            Culture: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          };

          return (
            <div
              key={act.id}
              className="group rounded-3xl overflow-hidden border border-white/15 bg-slate-900/50 backdrop-blur-2xl shadow-xl hover:border-teal-400/50 transition duration-300 flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={act.image_url}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                      categoryColors[act.category] || categoryColors.Sightseeing
                    }`}
                  >
                    {act.category}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/15 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>{act.rating || 4.8}</span>
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-white leading-tight group-hover:text-teal-300 transition">
                    {act.title}
                  </h3>
                  <div className="text-[11px] text-slate-300">{act.city_name}</div>
                </div>
              </div>

              <div className="p-4 space-y-3 bg-slate-900/60 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {act.description}
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 text-[10px]">Price & Duration:</span>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="text-emerald-300">{formatCurrency(act.cost)}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-400" /> {act.duration_hours}h
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAssign(act)}
                    className="px-3.5 py-2 rounded-xl bg-teal-400 text-slate-950 hover:bg-teal-300 font-bold text-xs shadow-md shadow-teal-500/20 active:scale-95 transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Plan</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Add to Itinerary Modal */}
      {activeModalAct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900/95 border border-white/20 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-slate-100">
            <button
              onClick={() => setActiveModalAct(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-white/10 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-400" />
              <span>Add to Active Itinerary</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              "{activeModalAct.title}" • {formatCurrency(activeModalAct.cost)}
            </p>

            <form onSubmit={handleAssignToTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Destination Stop
                </label>
                <select
                  value={targetStopId}
                  onChange={e => setTargetStopId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                >
                  {(activeTrip?.stops || []).map((stop, sIdx) => (
                    <option key={stop.id} value={stop.id} className="bg-slate-900">
                      Stop {sIdx + 1}: {stop.city?.name || 'City'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Day Number</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={targetDay}
                    onChange={e => setTargetDay(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={targetTime}
                    onChange={e => setTargetTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 hover:from-teal-300 hover:to-sky-300 transition"
              >
                Confirm & Add to Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
