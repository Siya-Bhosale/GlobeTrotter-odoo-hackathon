import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { Activity } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city_id = searchParams.get('city_id');
    const category = searchParams.get('category');
    const max_cost = searchParams.get('max_cost') ? parseFloat(searchParams.get('max_cost')!) : null;
    const search = searchParams.get('search')?.toLowerCase();

    if (isMySQLEnabled()) {
      try {
        let sql = `
          SELECT a.*, c.name as city_name 
          FROM activities_catalog a 
          JOIN cities c ON a.city_id = c.id 
          WHERE 1=1
        `;
        const params: any[] = [];

        if (city_id) {
          sql += ' AND a.city_id = ?';
          params.push(city_id);
        }
        if (category && category !== 'All') {
          sql += ' AND a.category = ?';
          params.push(category);
        }
        if (max_cost !== null) {
          sql += ' AND a.cost <= ?';
          params.push(max_cost);
        }
        if (search) {
          sql += ' AND (LOWER(a.title) LIKE ? OR LOWER(a.description) LIKE ? OR LOWER(c.name) LIKE ?)';
          const p = `%${search}%`;
          params.push(p, p, p);
        }
        sql += ' ORDER BY a.rating DESC, a.cost ASC';

        const rows = await query<Activity>(sql, params);
        return NextResponse.json({ activities: rows });
      } catch (err) {
        console.warn('MySQL activities query failed, falling back to mock store:', err);
      }
    }

    let result = [...mockStore.activities];

    if (city_id) {
      result = result.filter(a => a.city_id === city_id);
    }
    if (category && category !== 'All') {
      result = result.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    if (max_cost !== null) {
      result = result.filter(a => a.cost <= max_cost);
    }
    if (search) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        (a.city_name && a.city_name.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ activities: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
