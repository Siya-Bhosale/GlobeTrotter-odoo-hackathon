import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { Trip, TripStop, ItineraryItem } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { share_token: string } }
) {
  try {
    const shareToken = params.share_token;

    if (isMySQLEnabled()) {
      try {
        const tripRows = await query<Trip>(
          `SELECT t.*, u.name as user_name, u.avatar_url as user_avatar 
           FROM trips t 
           JOIN users u ON t.user_id = u.id 
           WHERE t.share_token = ? AND t.is_public = TRUE`,
          [shareToken]
        );

        if (tripRows && tripRows.length > 0) {
          const trip = tripRows[0];

          const stopRows = await query<TripStop>(
            `SELECT ts.*, c.name as city_name, c.country as city_country, c.image_url as city_image, c.region 
             FROM trip_stops ts 
             JOIN cities c ON ts.city_id = c.id 
             WHERE ts.trip_id = ? 
             ORDER BY ts.stop_order ASC`,
            [trip.id]
          );

          for (const stop of stopRows) {
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

          return NextResponse.json({ trip });
        }
      } catch (err) {
        console.warn('MySQL public trip lookup error:', err);
      }
    }

    const trip = mockStore.trips.find(t => t.share_token === shareToken && t.is_public);
    if (!trip) {
      return NextResponse.json({ error: 'Public trip not found or link is private' }, { status: 404 });
    }

    const owner = mockStore.users.find(u => u.id === trip.user_id);
    const publicTrip = {
      ...trip,
      user: owner ? { id: owner.id, name: owner.name, email: owner.email, avatar_url: owner.avatar_url } : undefined
    };

    return NextResponse.json({ trip: publicTrip });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
