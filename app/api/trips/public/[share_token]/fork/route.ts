import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { Trip, TripStop } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { share_token: string } }
) {
  try {
    const shareToken = params.share_token;
    const body = await request.json();
    const { user_id } = body;
    const targetUserId = user_id || 'user-demo-01';

    const sourceTrip = mockStore.trips.find(t => t.share_token === shareToken);
    if (!sourceTrip) {
      return NextResponse.json({ error: 'Source trip not found' }, { status: 404 });
    }

    const newTripId = `trip-${Date.now()}`;
    const newShareToken = `copy-${sourceTrip.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;

    const clonedStops: TripStop[] = (sourceTrip.stops || []).map((stop, sIdx) => {
      const newStopId = `stop-${newTripId}-${sIdx + 1}`;
      const clonedItems = (stop.items || []).map((item, iIdx) => ({
        ...item,
        id: `item-${Date.now()}-${sIdx}-${iIdx}`,
        trip_stop_id: newStopId
      }));

      return {
        ...stop,
        id: newStopId,
        trip_id: newTripId,
        items: clonedItems
      };
    });

    const forkedTrip: Trip = {
      ...sourceTrip,
      id: newTripId,
      user_id: targetUserId,
      name: `${sourceTrip.name} (My Fork)`,
      is_public: false,
      share_token: newShareToken,
      created_at: new Date().toISOString(),
      stops: clonedStops,
      expenses: []
    };

    if (isMySQLEnabled()) {
      try {
        await query(
          `INSERT INTO trips (id, user_id, name, description, start_date, end_date, total_budget, cover_image_url, is_public, share_token, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NOW())`,
          [forkedTrip.id, forkedTrip.user_id, forkedTrip.name, forkedTrip.description, forkedTrip.start_date, forkedTrip.end_date, forkedTrip.total_budget, forkedTrip.cover_image_url, forkedTrip.share_token]
        );

        for (const stop of clonedStops) {
          await query(
            `INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, stop_order, created_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [stop.id, stop.trip_id, stop.city_id, stop.arrival_date, stop.departure_date, stop.stop_order]
          );

          for (const item of stop.items || []) {
            await query(
              `INSERT INTO itinerary_items (id, trip_stop_id, activity_id, custom_title, day_number, start_time, duration_hours, cost, notes, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
              [item.id, item.trip_stop_id, item.activity_id, item.custom_title, item.day_number, item.start_time, item.duration_hours, item.cost, item.notes]
            );
          }
        }
      } catch (err) {
        console.warn('MySQL fork trip error:', err);
      }
    }

    mockStore.trips.unshift(forkedTrip);

    return NextResponse.json({ trip: forkedTrip }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
