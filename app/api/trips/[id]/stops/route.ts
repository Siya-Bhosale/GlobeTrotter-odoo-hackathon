import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { TripStop } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;
    const body = await request.json();
    const { city_id, arrival_date, departure_date, stop_order } = body;

    if (!city_id) {
      return NextResponse.json({ error: 'city_id is required' }, { status: 400 });
    }

    const trip = mockStore.trips.find(t => t.id === tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const city = mockStore.cities.find(c => c.id === city_id);
    const stops = trip.stops || [];
    const newStopOrder = stop_order || stops.length + 1;
    const stopId = `stop-${tripId}-${Date.now()}`;

    const newStop: TripStop = {
      id: stopId,
      trip_id: tripId,
      city_id,
      city,
      arrival_date: arrival_date || trip.start_date,
      departure_date: departure_date || trip.end_date,
      stop_order: newStopOrder,
      items: []
    };

    if (isMySQLEnabled()) {
      try {
        await query(
          `INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, stop_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [newStop.id, newStop.trip_id, newStop.city_id, newStop.arrival_date, newStop.departure_date, newStop.stop_order]
        );
      } catch (err) {
        console.warn('MySQL stop insert error:', err);
      }
    }

    if (!trip.stops) trip.stops = [];
    trip.stops.push(newStop);

    return NextResponse.json({ stop: newStop, trip }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
