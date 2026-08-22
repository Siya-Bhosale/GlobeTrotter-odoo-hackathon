import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { Expense } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;

    if (isMySQLEnabled()) {
      try {
        const expenses = await query<Expense>(
          'SELECT * FROM expenses WHERE trip_id = ? ORDER BY expense_date DESC',
          [tripId]
        );
        return NextResponse.json({ expenses });
      } catch (err) {
        console.warn('MySQL expenses GET error:', err);
      }
    }

    const trip = mockStore.trips.find(t => t.id === tripId);
    return NextResponse.json({ expenses: trip?.expenses || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;
    const body = await request.json();
    const { category, amount, expense_date, description } = body;

    if (!category || amount === undefined || !description) {
      return NextResponse.json({ error: 'Category, amount, and description are required' }, { status: 400 });
    }

    const trip = mockStore.trips.find(t => t.id === tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      trip_id: tripId,
      category,
      amount: Number(amount),
      expense_date: expense_date || new Date().toISOString().split('T')[0],
      description,
      created_at: new Date().toISOString()
    };

    if (isMySQLEnabled()) {
      try {
        await query(
          'INSERT INTO expenses (id, trip_id, category, amount, expense_date, description, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
          [newExpense.id, newExpense.trip_id, newExpense.category, newExpense.amount, newExpense.expense_date, newExpense.description]
        );
      } catch (err) {
        console.warn('MySQL expense insert error:', err);
      }
    }

    if (!trip.expenses) trip.expenses = [];
    trip.expenses.unshift(newExpense);

    return NextResponse.json({ expense: newExpense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
