import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;

    if (isMySQLEnabled()) {
      try {
        await query('DELETE FROM itinerary_items WHERE id = ?', [itemId]);
      } catch (err) {
        console.warn('MySQL itinerary item delete error:', err);
      }
    }

    let found = false;
    for (const trip of mockStore.trips) {
      if (trip.stops) {
        for (const stop of trip.stops) {
          if (stop.items) {
            const beforeLen = stop.items.length;
            stop.items = stop.items.filter(i => i.id !== itemId);
            if (stop.items.length !== beforeLen) {
              found = true;
              break;
            }
          }
        }
      }
      if (found) break;
    }

    return NextResponse.json({ success: true, deleted: found });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;
    const body = await request.json();
    const { custom_title, day_number, start_time, duration_hours, cost, notes } = body;

    if (isMySQLEnabled()) {
      try {
        await query(
          `UPDATE itinerary_items SET 
           custom_title = COALESCE(?, custom_title), 
           day_number = COALESCE(?, day_number), 
           start_time = COALESCE(?, start_time), 
           duration_hours = COALESCE(?, duration_hours), 
           cost = COALESCE(?, cost), 
           notes = COALESCE(?, notes) 
           WHERE id = ?`,
          [custom_title, day_number, start_time, duration_hours, cost, notes, itemId]
        );
      } catch (err) {
        console.warn('MySQL itinerary item update error:', err);
      }
    }

    let updatedItem = null;
    for (const trip of mockStore.trips) {
      if (trip.stops) {
        for (const stop of trip.stops) {
          if (stop.items) {
            const item = stop.items.find(i => i.id === itemId);
            if (item) {
              if (custom_title !== undefined) item.custom_title = custom_title;
              if (day_number !== undefined) item.day_number = Number(day_number);
              if (start_time !== undefined) item.start_time = start_time;
              if (duration_hours !== undefined) item.duration_hours = Number(duration_hours);
              if (cost !== undefined) item.cost = Number(cost);
              if (notes !== undefined) item.notes = notes;
              updatedItem = item;
              break;
            }
          }
        }
      }
      if (updatedItem) break;
    }

    return NextResponse.json({ item: updatedItem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
