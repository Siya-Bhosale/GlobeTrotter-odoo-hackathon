import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import { isMySQLEnabled, query } from '@/lib/db';
import { BudgetSummary, Expense } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;

    if (isMySQLEnabled()) {
      try {
        const tripRows = await query('SELECT total_budget, start_date, end_date FROM trips WHERE id = ?', [tripId]);
        if (tripRows && tripRows.length > 0) {
          const trip = tripRows[0];
          const totalBudget = Number(trip.total_budget);

          const expenses = await query<Expense>(
            'SELECT * FROM expenses WHERE trip_id = ? ORDER BY expense_date DESC',
            [tripId]
          );

          const catSumRows = await query<{ category: any; total: number }>(
            'SELECT category, SUM(amount) as total FROM expenses WHERE trip_id = ? GROUP BY category',
            [tripId]
          );

          const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
          const remaining = totalBudget - totalSpent;
          const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

          const start = new Date(trip.start_date);
          const end = new Date(trip.end_date);
          const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
          const dailyAvg = totalSpent / days;

          const allCats: ('Transport' | 'Stay' | 'Activities' | 'Meals' | 'Other')[] = [
            'Transport', 'Stay', 'Activities', 'Meals', 'Other'
          ];

          const byCategory = allCats.map(cat => {
            const found = catSumRows.find(r => r.category === cat);
            const amt = found ? Number(found.total) : 0;
            return {
              category: cat,
              amount: amt,
              percentage: totalSpent > 0 ? (amt / totalSpent) * 100 : 0
            };
          });

          const summary: BudgetSummary = {
            trip_id: tripId,
            total_budget: totalBudget,
            total_spent: totalSpent,
            remaining_budget: remaining,
            percent_spent: percentSpent,
            daily_average_spent: dailyAvg,
            is_over_budget: remaining < 0,
            by_category: byCategory,
            expenses: expenses
          };

          return NextResponse.json({ summary });
        }
      } catch (err) {
        console.warn('MySQL budget summary query error, falling back to mock store:', err);
      }
    }

    const summary = mockStore.getTripBudgetSummary(tripId);
    if (!summary) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
