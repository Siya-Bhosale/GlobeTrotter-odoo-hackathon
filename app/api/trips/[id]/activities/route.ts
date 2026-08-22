import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { ItineraryItem } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;
    const body = await request.json();
    const {
      trip_stop_id,
      activity_id,
      custom_title,
      day_number,
      start_time,
      duration_hours,
      cost,
      notes
    } = body;

    if (!trip_stop_id) {
      return NextResponse.json({ error: 'trip_stop_id is required' }, { status: 400 });
    }

    const trip = mockStore.trips.find(t => t.id === tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const stop = trip.stops?.find(s => s.id === trip_stop_id);
    if (!stop) {
      return NextResponse.json({ error: 'Trip stop not found' }, { status: 404 });
    }

    const activity = activity_id ? mockStore.activities.find(a => a.id === activity_id) : undefined;
    const itemId = `item-${Date.now()}`;

    const newItem: ItineraryItem = {
      id: itemId,
      trip_stop_id,
      activity_id: activity_id || null,
      activity,
      custom_title: custom_title || activity?.title || 'Custom Activity',
      day_number: Number(day_number) || 1,
      start_time: start_time || '10:00:00',
      duration_hours: duration_hours !== undefined ? Number(duration_hours) : (activity?.duration_hours || 2.0),
      cost: cost !== undefined ? Number(cost) : (activity?.cost || 0.0),
      notes: notes || ''
    };

    if (isMySQLEnabled()) {
      try {
        await query(
          `INSERT INTO itinerary_items (id, trip_stop_id, activity_id, custom_title, day_number, start_time, duration_hours, cost, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [newItem.id, newItem.trip_stop_id, newItem.activity_id, newItem.custom_title, newItem.day_number, newItem.start_time, newItem.duration_hours, newItem.cost, newItem.notes]
        );
      } catch (err) {
        console.warn('MySQL itinerary item insert error:', err);
      }
    }

    if (!stop.items) stop.items = [];
    stop.items.push(newItem);

    // Optionally also log as an Activity expense
    if (newItem.cost > 0) {
      const expense = {
        id: `exp-${Date.now()}`,
        trip_id: tripId,
        category: 'Activities' as const,
        amount: newItem.cost,
        expense_date: new Date().toISOString().split('T')[0],
        description: `Activity: ${newItem.custom_title}`
      };
      if (!trip.expenses) trip.expenses = [];
      trip.expenses.push(expense);
    }

    return NextResponse.json({ item: newItem, stop }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
