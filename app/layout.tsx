import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ToastContainer } from '@/components/ToastContainer';
import AuthModal from '@/components/AuthModal';
import { CreateTripModal } from '@/components/CreateTripModal';

export const metadata: Metadata = {
  title: 'GlobeTrotter - Multi-City Travel Planning Platform',
  description: 'Plan, budget, and explore world-class multi-city travel itineraries with real-time analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="relative bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden">
        {/* Dynamic Glowing Ambient Mesh Gradient Orbs */}
        <div className="ambient-mesh" aria-hidden="true">
          <div className="ambient-orb orb-1" />
          <div className="ambient-orb orb-2" />
          <div className="ambient-orb orb-3" />
        </div>

        <AppProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
            <ToastContainer />
            <AuthModal />
            <CreateTripModal />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
