import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { Trip, TripStop, ItineraryItem, Expense } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;

    if (isMySQLEnabled()) {
      try {
        const tripRows = await query<Trip>('SELECT * FROM trips WHERE id = ?', [tripId]);
        if (tripRows && tripRows.length > 0) {
          const trip = tripRows[0];

          // Fetch stops with cities
          const stopRows = await query<TripStop>(
            `SELECT ts.*, c.name as city_name, c.country as city_country, c.image_url as city_image, c.region, c.cost_index 
             FROM trip_stops ts 
             JOIN cities c ON ts.city_id = c.id 
             WHERE ts.trip_id = ? 
             ORDER BY ts.stop_order ASC`,
            [tripId]
          );

          for (const stop of stopRows) {
            // Fetch itinerary items with activity details
            const items = await query<ItineraryItem>(
              `SELECT ii.*, ac.title as act_title, ac.category as act_category, ac.image_url as act_image, ac.rating as act_rating 
               FROM itinerary_items ii 
               LEFT JOIN activities_catalog ac ON ii.activity_id = ac.id 
               WHERE ii.trip_stop_id = ? 
               ORDER BY ii.day_number ASC, ii.start_time ASC`,
              [stop.id]
            );
            stop.items = items;
          }
          trip.stops = stopRows;

          // Fetch expenses
          const expenses = await query<Expense>(
            'SELECT * FROM expenses WHERE trip_id = ? ORDER BY expense_date DESC',
            [tripId]
          );
          trip.expenses = expenses;

          return NextResponse.json({ trip });
        }
      } catch (err) {
        console.warn('MySQL trip by ID lookup failed, checking mock store:', err);
      }
    }

    const trip = mockStore.trips.find(t => t.id === tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ trip });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;
    const body = await request.json();
    const { name, description, start_date, end_date, total_budget, cover_image_url, is_public } = body;

    if (isMySQLEnabled()) {
      try {
        await query(
          `UPDATE trips SET 
           name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           start_date = COALESCE(?, start_date), 
           end_date = COALESCE(?, end_date), 
           total_budget = COALESCE(?, total_budget), 
           cover_image_url = COALESCE(?, cover_image_url), 
           is_public = COALESCE(?, is_public) 
           WHERE id = ?`,
          [name, description, start_date, end_date, total_budget, cover_image_url, is_public !== undefined ? (is_public ? 1 : 0) : null, tripId]
        );
      } catch (err) {
        console.warn('MySQL trip update error:', err);
      }
    }

    const tripIndex = mockStore.trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const currentTrip = mockStore.trips[tripIndex];
    if (name !== undefined) currentTrip.name = name;
    if (description !== undefined) currentTrip.description = description;
    if (start_date !== undefined) currentTrip.start_date = start_date;
    if (end_date !== undefined) currentTrip.end_date = end_date;
    if (total_budget !== undefined) currentTrip.total_budget = Number(total_budget);
    if (cover_image_url !== undefined) currentTrip.cover_image_url = cover_image_url;
    if (is_public !== undefined) currentTrip.is_public = is_public;

    return NextResponse.json({ trip: currentTrip });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;

    if (isMySQLEnabled()) {
      try {
        await query('DELETE FROM trips WHERE id = ?', [tripId]);
      } catch (err) {
        console.warn('MySQL trip delete error:', err);
      }
    }

    const initialLen = mockStore.trips.length;
    mockStore.trips = mockStore.trips.filter(t => t.id !== tripId);

    return NextResponse.json({ success: true, deleted: initialLen !== mockStore.trips.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
