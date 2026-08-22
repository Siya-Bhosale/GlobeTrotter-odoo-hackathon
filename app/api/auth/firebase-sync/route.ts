import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, email, displayName, photoURL, language, home_currency } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const userId = uid || `user-${Date.now()}`;
    const name = displayName || email.split('@')[0].replace('.', ' ').replace(/^./, (str: string) => str.toUpperCase()) || 'Explorer';
    const avatar = photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
    const lang = language || 'en';
    const curr = home_currency || 'USD';

    if (isMySQLEnabled()) {
      try {
        const existingUsers = await query<User>('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers && existingUsers.length > 0) {
          const u = existingUsers[0];
          return NextResponse.json({ user: u, token: `fb_token_${u.id}` });
        }

        await query(
          'INSERT INTO users (id, name, email, password_hash, avatar_url, language, home_currency, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
          [userId, name, email, 'firebase_managed', avatar, lang, curr]
        );

        const newUser: User = {
          id: userId,
          name,
          email,
          avatar_url: avatar,
          language: lang,
          home_currency: curr,
          created_at: new Date().toISOString()
        };

        return NextResponse.json({ user: newUser, token: `fb_token_${newUser.id}` });
      } catch (err) {
        console.warn('MySQL firebase sync error, saving in mock store:', err);
      }
    }

    let user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: userId,
        name,
        email,
        avatar_url: avatar,
        language: lang,
        home_currency: curr,
        created_at: new Date().toISOString()
      };
      mockStore.users.push(user);
    }

    return NextResponse.json({
      user,
      token: `fb_token_${user.id}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Firebase sync failed' }, { status: 500 });
  }
}
