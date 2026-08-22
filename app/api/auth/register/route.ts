import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, avatar_url, language, home_currency } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar_url: avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      language: language || 'en',
      home_currency: home_currency || 'USD',
      created_at: new Date().toISOString(),
    };

    if (isMySQLEnabled()) {
      try {
        await query(
          'INSERT INTO users (id, name, email, password_hash, avatar_url, language, home_currency, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
          [newUser.id, newUser.name, newUser.email, 'hashed_demo_pw', newUser.avatar_url, newUser.language, newUser.home_currency]
        );
      } catch (err) {
        console.warn('MySQL user insert error:', err);
      }
    }

    // Save in mock store
    const existing = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      mockStore.users.push(newUser);
    }

    return NextResponse.json({
      user: newUser,
      token: `token_${newUser.id}_${Date.now()}`
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
