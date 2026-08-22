'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Calendar, DollarSign, Image as ImageIcon, MapPin, Sparkles, Globe, Lock, Check } from 'lucide-react';

export const CreateTripModal: React.FC = () => {
  const {
    isCreateTripOpen,
    setIsCreateTripOpen,
    createTrip,
    cities,
    setActiveView,
    selectedCityForTrip,
    setSelectedCityForTrip
  } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [budget, setBudget] = useState('3500');
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>(
    selectedCityForTrip ? [selectedCityForTrip.id] : ['city-paris', 'city-rome']
  );
  const [isPublic, setIsPublic] = useState(true);
  const [coverUrl, setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
  );
  const [loading, setLoading] = useState(false);

  if (!isCreateTripOpen) return null;

  const handleCityToggle = (cityId: string) => {
    if (selectedCityIds.includes(cityId)) {
      setSelectedCityIds(selectedCityIds.filter(id => id !== cityId));
    } else {
      setSelectedCityIds([...selectedCityIds, cityId]);
      const city = cities.find(c => c.id === cityId);
      if (city && !coverUrl) {
        setCoverUrl(city.image_url);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return;

    setLoading(true);
    const newTrip = await createTrip({
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      total_budget: Number(budget) || 2500,
      cover_image_url: coverUrl,
      is_public: isPublic,
      selected_cities: selectedCityIds
    });

    setLoading(false);
    if (newTrip) {
      setIsCreateTripOpen(false);
      setSelectedCityForTrip(null);
      setActiveView('itinerary');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900/90 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsCreateTripOpen(false);
            setSelectedCityForTrip(null);
          }}
          className="absolute right-5 top-5 p-1.5 rounded-full bg-white/10 text-slate-400 hover:text-white hover:bg-white/20 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-500 text-slate-950 shadow-lg shadow-teal-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Create New Journey</h2>
            <p className="text-xs text-slate-400">
              Configure your destinations, dates, and budget targets.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Trip Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Trip Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mediterranean Coastal Escape 2026"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Trip Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Highlights, packing goals, and travel themes..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md resize-none"
              />
            </div>
          </div>

          {/* Dates & Budget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Start Date *</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>End Date *</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Budget Cap (USD)</span>
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
              />
            </div>
          </div>

          {/* Select Destinations / Multi-City */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Select Multi-City Destinations ({selectedCityIds.length} chosen)</span>
              </div>
              <span className="text-[11px] text-teal-300 font-normal">Click to toggle</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
              {cities.map(city => {
                const isSelected = selectedCityIds.includes(city.id);
                return (
                  <div
                    key={city.id}
                    onClick={() => handleCityToggle(city.id)}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden border transition group ${
                      isSelected
                        ? 'border-teal-400 ring-2 ring-teal-400/40'
                        : 'border-white/15 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={city.image_url}
                      alt={city.name}
                      className="w-full h-20 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-2 flex flex-col justify-between">
                      <div className="flex justify-end">
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">{city.name}</div>
                        <div className="text-[10px] text-slate-300">{city.country}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy & Cover URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cover Image URL</span>
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 backdrop-blur-md"
              />
            </div>

            <div className="flex flex-col justify-end">
              <div
                onClick={() => setIsPublic(!isPublic)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/15 cursor-pointer hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Globe className="w-4 h-4 text-teal-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {isPublic ? 'Public Shareable Itinerary' : 'Private Itinerary'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isPublic ? 'Generate instant share token' : 'Only visible to you'}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition p-0.5 ${
                    isPublic ? 'bg-teal-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition transform ${
                      isPublic ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading || selectedCityIds.length === 0}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-300 to-sky-400 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/25 hover:from-teal-300 hover:to-sky-300 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Initializing Itinerary...' : 'Build Multi-City Journey'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
