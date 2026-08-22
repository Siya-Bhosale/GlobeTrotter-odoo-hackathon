import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { Trip, TripStop } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-01';

    if (isMySQLEnabled()) {
      try {
        const trips = await query<Trip>(
          'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC',
          [userId]
        );

        for (const trip of trips) {
          const stops = await query<TripStop>(
            `SELECT ts.*, c.name as city_name, c.country, c.image_url as city_image 
             FROM trip_stops ts 
             JOIN cities c ON ts.city_id = c.id 
             WHERE ts.trip_id = ? 
             ORDER BY ts.stop_order ASC`,
            [trip.id]
          );
          trip.stops = stops;
        }

        return NextResponse.json({ trips });
      } catch (err) {
        console.warn('MySQL trips GET failed, using mock store:', err);
      }
    }

    const trips = mockStore.trips.filter(t => t.user_id === userId);
    return NextResponse.json({ trips });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      start_date,
      end_date,
      total_budget,
      cover_image_url,
      is_public,
      user_id,
      selected_cities
    } = body;

    if (!name || !start_date || !end_date) {
      return NextResponse.json({ error: 'Name, start_date, and end_date are required' }, { status: 400 });
    }

    const tripId = `trip-${Date.now()}`;
    const shareToken = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;
    const userIdFinal = user_id || 'user-demo-01';
    const budgetFinal = Number(total_budget) || 2500;

    // Pick first city cover if not provided
    let cover = cover_image_url;
    if (!cover && selected_cities && selected_cities.length > 0) {
      const firstCity = mockStore.cities.find(c => c.id === selected_cities[0]);
      if (firstCity) cover = firstCity.image_url;
    }
    if (!cover) {
      cover = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
    }

    const stops: TripStop[] = [];
    if (selected_cities && Array.isArray(selected_cities)) {
      selected_cities.forEach((cityId: string, idx: number) => {
        const city = mockStore.cities.find(c => c.id === cityId);
        stops.push({
          id: `stop-${tripId}-${idx + 1}`,
          trip_id: tripId,
          city_id: cityId,
          city: city,
          arrival_date: start_date,
          departure_date: end_date,
          stop_order: idx + 1,
          items: []
        });
      });
    }

    const newTrip: Trip = {
      id: tripId,
      user_id: userIdFinal,
      name,
      description: description || '',
      start_date,
      end_date,
      total_budget: budgetFinal,
      cover_image_url: cover,
      is_public: !!is_public,
      share_token: shareToken,
      created_at: new Date().toISOString(),
      stops: stops,
      expenses: []
    };

    if (isMySQLEnabled()) {
      try {
        await query(
          `INSERT INTO trips (id, user_id, name, description, start_date, end_date, total_budget, cover_image_url, is_public, share_token, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [newTrip.id, newTrip.user_id, newTrip.name, newTrip.description, newTrip.start_date, newTrip.end_date, newTrip.total_budget, newTrip.cover_image_url, newTrip.is_public ? 1 : 0, newTrip.share_token]
        );

        for (const stop of stops) {
          await query(
            `INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, stop_order, created_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [stop.id, stop.trip_id, stop.city_id, stop.arrival_date, stop.departure_date, stop.stop_order]
          );
        }
      } catch (err) {
        console.warn('MySQL trip insertion failed, saved in mock store:', err);
      }
    }

    mockStore.trips.unshift(newTrip);

    return NextResponse.json({ trip: newTrip }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
