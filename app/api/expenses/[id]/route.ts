import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const expenseId = params.id;

    if (isMySQLEnabled()) {
      try {
        await query('DELETE FROM expenses WHERE id = ?', [expenseId]);
      } catch (err) {
        console.warn('MySQL expense delete error:', err);
      }
    }

    let deleted = false;
    for (const trip of mockStore.trips) {
      if (trip.expenses) {
        const beforeLen = trip.expenses.length;
        trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
        if (trip.expenses.length !== beforeLen) {
          deleted = true;
          break;
        }
      }
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
