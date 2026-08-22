'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { DashboardView } from '@/components/DashboardView';
import { MyTripsView } from '@/components/MyTripsView';
import { ItineraryBuilder } from '@/components/ItineraryBuilder';
import { CitySearchCatalog } from '@/components/CitySearchCatalog';
import { ActivitySearchCatalog } from '@/components/ActivitySearchCatalog';
import { BudgetAnalyticsView } from '@/components/BudgetAnalyticsView';
import { TripCalendarView } from '@/components/TripCalendarView';
import { PublicTripView } from '@/components/PublicTripView';
import { UserProfileSettings } from '@/components/UserProfileSettings';
import { AdminAnalyticsView } from '@/components/AdminAnalyticsView';

export default function Home() {
  const { activeView, setActiveView } = useApp();

  // Check URL search parameters on initial load (e.g. ?view=public)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam) {
        setActiveView(viewParam);
      }
    }
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'trips':
        return <MyTripsView />;
      case 'itinerary':
        return <ItineraryBuilder />;
      case 'cities':
      case 'explore':
        return <CitySearchCatalog />;
      case 'activities':
        return <ActivitySearchCatalog />;
      case 'budget':
        return <BudgetAnalyticsView />;
      case 'calendar':
        return <TripCalendarView />;
      case 'public':
        return <PublicTripView />;
      case 'admin':
        return <AdminAnalyticsView />;
      case 'settings':
      case 'profile':
        return <UserProfileSettings />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Glass Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Collapsible Glass Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-full overflow-x-hidden">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Sticky Glass Navigation Dock */}
      <MobileNav />
    </div>
  );
}
