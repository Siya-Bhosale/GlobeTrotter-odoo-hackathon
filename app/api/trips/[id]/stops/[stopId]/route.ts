import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; stopId: string } }
) {
  try {
    const { id: tripId, stopId } = params;

    if (isMySQLEnabled()) {
      try {
        await query('DELETE FROM trip_stops WHERE id = ? AND trip_id = ?', [stopId, tripId]);
      } catch (err) {
        console.warn('MySQL stop delete error:', err);
      }
    }

    const trip = mockStore.trips.find(t => t.id === tripId);
    if (trip && trip.stops) {
      trip.stops = trip.stops.filter(s => s.id !== stopId);
      trip.stops.forEach((s, idx) => {
        s.stop_order = idx + 1;
      });
    }

    return NextResponse.json({ success: true, stops: trip?.stops || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
