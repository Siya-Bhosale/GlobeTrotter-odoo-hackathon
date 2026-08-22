'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Search,
  Plus,
  Star,
  DollarSign,
  Compass,
  Sparkles,
  Globe,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { City } from '@/lib/types';

export const CitySearchCatalog: React.FC = () => {
  const {
    cities,
    activeTrip,
    addStop,
    setSelectedCityForTrip,
    setIsCreateTripOpen,
    setActiveView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCost, setSelectedCost] = useState('All');

  const regions = ['All', 'Europe', 'Asia', 'Middle East', 'North America', 'Southeast Asia'];
  const costTiers = ['All', '$', '$$', '$$$'];

  const filteredCities = cities.filter(city => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (city.description && city.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = selectedRegion === 'All' || city.region.toLowerCase() === selectedRegion.toLowerCase();
    const matchesCost = selectedCost === 'All' || city.cost_index === selectedCost;

    return matchesSearch && matchesRegion && matchesCost;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-teal-400" />
            <span>Destination Explorer</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover global capitals, cultural hubs, and scenic landscapes for your journey.
          </p>
        </div>

        {activeTrip && (
          <div className="px-3.5 py-1.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-200 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto">
            <span>Adding to:</span>
            <strong className="text-white">{activeTrip.name}</strong>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl space-y-4 shadow-lg">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city, country, monuments, keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/15 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
          />
        </div>

        {/* Region & Cost Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Region:</span>
            {regions.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  selectedRegion === reg
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Cost Index Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Cost:</span>
            {costTiers.map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedCost(tier)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCost === tier
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCities.map(city => {
          const isAlreadyInActiveTrip = (activeTrip?.stops || []).some(s => s.city_id === city.id);

          return (
            <div
              key={city.id}
              className="group rounded-3xl overflow-hidden border border-white/15 bg-slate-900/50 backdrop-blur-2xl shadow-xl hover:border-teal-400/50 hover:shadow-2xl hover:shadow-teal-500/10 transition duration-300 flex flex-col justify-between"
            >
              {/* Photo & Overlays */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={city.image_url}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/15 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>{city.popularity_score}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-white/15">
                    {city.cost_index} Cost
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white leading-tight">{city.name}</h3>
                  <div className="text-[11px] text-slate-300">{city.country} • {city.region}</div>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-4 space-y-3 bg-slate-900/60 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {city.description}
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  {activeTrip ? (
                    <button
                      onClick={async () => {
                        await addStop(activeTrip.id, city.id);
                        setActiveView('itinerary');
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isAlreadyInActiveTrip
                          ? 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/15'
                          : 'bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-md shadow-teal-500/20'
                      }`}
                    >
                      {isAlreadyInActiveTrip ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-300" />
                          <span>Added (Add Another Stop)</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Active Trip</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedCityForTrip(city);
                        setIsCreateTripOpen(true);
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-md hover:from-teal-300 hover:to-sky-300 transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Trip with {city.name}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
