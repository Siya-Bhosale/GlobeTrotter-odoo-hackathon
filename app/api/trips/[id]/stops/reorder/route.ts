import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;
    const body = await request.json();
    const { ordered_stop_ids } = body; // Array of stop IDs in new sequence

    if (!ordered_stop_ids || !Array.isArray(ordered_stop_ids)) {
      return NextResponse.json({ error: 'ordered_stop_ids array is required' }, { status: 400 });
    }

    const trip = mockStore.trips.find(t => t.id === tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    if (isMySQLEnabled()) {
      try {
        for (let i = 0; i < ordered_stop_ids.length; i++) {
          await query(
            'UPDATE trip_stops SET stop_order = ? WHERE id = ? AND trip_id = ?',
            [i + 1, ordered_stop_ids[i], tripId]
          );
        }
      } catch (err) {
        console.warn('MySQL stop reorder error:', err);
      }
    }

    if (trip.stops) {
      trip.stops.sort((a, b) => {
        const indexA = ordered_stop_ids.indexOf(a.id);
        const indexB = ordered_stop_ids.indexOf(b.id);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      trip.stops.forEach((stop, idx) => {
        stop.stop_order = idx + 1;
      });
    }

    return NextResponse.json({ success: true, stops: trip.stops });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
