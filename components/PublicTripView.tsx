'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Share2,
  Copy,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Globe,
  CheckCircle2,
  User
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Trip } from '@/lib/types';

export const PublicTripView: React.FC = () => {
  const { activeTrip, forkTrip, formatCurrency, showToast } = useApp();
  const [publicTrip, setPublicTrip] = useState<Trip | null>(activeTrip);
  const [tokenInput, setTokenInput] = useState(activeTrip?.share_token || 'euro-odyssey-2026');
  const [loading, setLoading] = useState(false);
  const [isForking, setIsForking] = useState(false);

  const fetchPublicTrip = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/public/${token}`);
      const data = await res.json();
      if (data.trip) {
        setPublicTrip(data.trip);
      } else {
        showToast('Public trip not found or private', 'warning');
      }
    } catch (e) {
      showToast('Error loading public trip', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTrip?.share_token) {
      setTokenInput(activeTrip.share_token);
      fetchPublicTrip(activeTrip.share_token);
    } else {
      fetchPublicTrip('euro-odyssey-2026');
    }
  }, [activeTrip]);

  const handleFork = async () => {
    if (!publicTrip?.share_token) return;
    setIsForking(true);
    await forkTrip(publicTrip.share_token);
    setIsForking(false);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?view=public&token=${publicTrip?.share_token || 'euro-odyssey-2026'}`;
    navigator.clipboard.writeText(url);
    showToast('Public shareable link copied!', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Share Token Input Bar for testing/viewing any share token */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 w-full sm:w-auto">
          <Globe className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Public Share Token:</span>
          <input
            type="text"
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            placeholder="e.g. euro-odyssey-2026"
            className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
          <button
            onClick={() => fetchPublicTrip(tokenInput)}
            className="px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/30"
          >
            Load
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Copy Link</span>
          </button>

          <button
            onClick={handleFork}
            disabled={isForking || !publicTrip}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/25 hover:from-teal-300 hover:to-sky-300 active:scale-95 transition flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isForking ? 'Cloning Itinerary...' : 'Fork / Copy to My Trips'}</span>
          </button>
        </div>
      </div>

      {publicTrip && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900/60 backdrop-blur-2xl shadow-2xl">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={publicTrip.cover_image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
                alt={publicTrip.name}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-500/90 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
                  Shared Public Itinerary
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/20">
                  Target Budget: {formatCurrency(Number(publicTrip.total_budget))}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {publicTrip.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  {publicTrip.description}
                </p>

                {/* Author attribution */}
                <div className="pt-2 flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-teal-400 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    {publicTrip.user?.name ? publicTrip.user.name[0] : 'E'}
                  </div>
                  <span>Curated by <strong>{publicTrip.user?.name || 'Explorer'}</strong></span>
                  <span>•</span>
                  <span>
                    {format(parseISO(publicTrip.start_date), 'MMM dd')} - {format(parseISO(publicTrip.end_date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-City Sequenced Stops */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-400" />
              <span>Full Route Schedule ({(publicTrip.stops || []).length} Destinations)</span>
            </h2>

            <div className="space-y-6">
              {(publicTrip.stops || []).map((stop, idx) => (
                <div
                  key={stop.id}
                  className="rounded-3xl border border-white/15 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-black text-base">
                      #{idx + 1}
                    </div>

                    {stop.city && (
                      <img
                        src={stop.city.image_url}
                        alt={stop.city.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-1 ring-white/20"
                      />
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-white">{stop.city?.name}</h3>
                      <div className="text-xs text-slate-400">
                        {stop.city?.country} • {stop.items?.length || 0} scheduled activities
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(stop.items || []).map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3"
                      >
                        {item.activity?.image_url && (
                          <img
                            src={item.activity.image_url}
                            alt={item.custom_title}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        )}
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-white leading-tight">
                            {item.custom_title || item.activity?.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>Day {item.day_number} at {item.start_time.substring(0, 5)}</span>
                            <span>•</span>
                            <span className="text-emerald-300 font-semibold">{formatCurrency(item.cost)}</span>
                          </div>
                          {item.notes && (
                            <div className="text-[10px] text-slate-400 italic">"{item.notes}"</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
