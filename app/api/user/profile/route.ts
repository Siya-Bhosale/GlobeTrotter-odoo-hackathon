import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-01';

    if (isMySQLEnabled()) {
      try {
        const rows = await query('SELECT id, name, email, avatar_url, language, home_currency, created_at FROM users WHERE id = ?', [userId]);
        if (rows && rows.length > 0) {
          return NextResponse.json({ user: rows[0] });
        }
      } catch (err) {
        console.warn('MySQL profile lookup error:', err);
      }
    }

    const user = mockStore.users.find(u => u.id === userId) || mockStore.users[0];
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, avatar_url, language, home_currency } = body;

    const targetId = id || 'user-demo-01';

    if (isMySQLEnabled()) {
      try {
        await query(
          'UPDATE users SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url), language = COALESCE(?, language), home_currency = COALESCE(?, home_currency) WHERE id = ?',
          [name, avatar_url, language, home_currency, targetId]
        );
      } catch (err) {
        console.warn('MySQL profile update error:', err);
      }
    }

    const userIndex = mockStore.users.findIndex(u => u.id === targetId);
    if (userIndex !== -1) {
      if (name) mockStore.users[userIndex].name = name;
      if (avatar_url) mockStore.users[userIndex].avatar_url = avatar_url;
      if (language) mockStore.users[userIndex].language = language;
      if (home_currency) mockStore.users[userIndex].home_currency = home_currency;
      return NextResponse.json({ user: mockStore.users[userIndex] });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
