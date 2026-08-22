import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (isMySQLEnabled()) {
      try {
        const rows = await query('SELECT id, name, email, avatar_url, language, home_currency, created_at FROM users WHERE email = ? LIMIT 1', [email]);
        if (rows && rows.length > 0) {
          return NextResponse.json({
            user: rows[0],
            token: `token_${rows[0].id}_${Date.now()}`
          });
        }
      } catch (err) {
        console.warn('MySQL auth lookup error, checking mock store', err);
      }
    }

    // Check mock store
    let user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // If demo login or user not found, fallback to primary demo user or create session user
    if (!user) {
      const rawName = email.split('@')[0].replace('.', ' ');
      user = {
        id: `user-${Date.now()}`,
        name: rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Explorer',
        email: email,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        language: 'en',
        home_currency: 'USD',
        created_at: new Date().toISOString()
      };
      mockStore.users.push(user);
    }

    return NextResponse.json({
      user,
      token: `token_${user.id}_${Date.now()}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
