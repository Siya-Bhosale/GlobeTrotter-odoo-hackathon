import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { City } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const country = searchParams.get('country');
    const cost_index = searchParams.get('cost_index');
    const min_popularity = searchParams.get('popularity') ? parseFloat(searchParams.get('popularity')!) : null;
    const search = searchParams.get('search')?.toLowerCase();

    if (isMySQLEnabled()) {
      try {
        let sql = 'SELECT * FROM cities WHERE 1=1';
        const params: any[] = [];

        if (region) {
          sql += ' AND region = ?';
          params.push(region);
        }
        if (country) {
          sql += ' AND country = ?';
          params.push(country);
        }
        if (cost_index) {
          sql += ' AND cost_index = ?';
          params.push(cost_index);
        }
        if (min_popularity !== null) {
          sql += ' AND popularity_score >= ?';
          params.push(min_popularity);
        }
        if (search) {
          sql += ' AND (LOWER(name) LIKE ? OR LOWER(country) LIKE ? OR LOWER(region) LIKE ?)';
          const p = `%${search}%`;
          params.push(p, p, p);
        }
        sql += ' ORDER BY popularity_score DESC';

        const rows = await query<City>(sql, params);
        return NextResponse.json({ cities: rows });
      } catch (err) {
        console.warn('MySQL cities query failed, falling back to mock store:', err);
      }
    }

    let result = [...mockStore.cities];

    if (region && region !== 'All') {
      result = result.filter(c => c.region.toLowerCase() === region.toLowerCase());
    }
    if (country && country !== 'All') {
      result = result.filter(c => c.country.toLowerCase() === country.toLowerCase());
    }
    if (cost_index && cost_index !== 'All') {
      result = result.filter(c => c.cost_index === cost_index);
    }
    if (min_popularity !== null) {
      result = result.filter(c => c.popularity_score >= min_popularity);
    }
    if (search) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.country.toLowerCase().includes(search) ||
        c.region.toLowerCase().includes(search) ||
        (c.description && c.description.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ cities: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
