'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  PieChart as PieIcon,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Tag,
  CreditCard
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BudgetSummary, ExpenseCategory, Expense } from '@/lib/types';
import { format, parseISO } from 'date-fns';

export const BudgetAnalyticsView: React.FC = () => {
  const {
    activeTrip,
    formatCurrency,
    addExpense,
    deleteExpense,
    setActiveView
  } = useApp();

  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // New Expense Form State
  const [category, setCategory] = useState<ExpenseCategory>('Meals');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const fetchBudget = async () => {
    if (!activeTrip) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${activeTrip.id}/budget`);
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (e) {
      console.error('Error fetching budget summary', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBudget();
  }, [activeTrip]);

  if (!activeTrip) {
    return (
      <div className="text-center py-20 p-8 rounded-3xl border border-white/15 bg-slate-900/40 backdrop-blur-xl animate-in fade-in">
        <DollarSign className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">No active trip selected</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
          Please select a trip to view and manage its budget analytics.
        </p>
        <button
          onClick={() => setActiveView('trips')}
          className="px-5 py-2.5 rounded-2xl bg-teal-400 text-slate-950 font-bold text-xs shadow-lg hover:bg-teal-300 transition"
        >
          Select from My Trips &rarr;
        </button>
      </div>
    );
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    await addExpense(activeTrip.id, {
      category,
      amount: Number(amount),
      expense_date: expenseDate,
      description
    });

    setAmount('');
    setDescription('');
    fetchBudget();
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(activeTrip.id, id);
    fetchBudget();
  };

  const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    Transport: '#38bdf8', // sky
    Stay: '#818cf8',      // indigo
    Activities: '#2dd4bf',// teal
    Meals: '#fbbf24',     // amber
    Other: '#fb7185',     // rose
  };

  const chartData = (summary?.by_category || [])
    .filter(c => c.amount > 0)
    .map(c => ({
      name: c.category,
      value: c.amount,
      color: CATEGORY_COLORS[c.category] || '#94a3b8'
    }));

  const totalSpent = summary?.total_spent || 0;
  const budgetLimit = summary?.total_budget || Number(activeTrip.total_budget);
  const remaining = summary?.remaining_budget ?? (budgetLimit - totalSpent);
  const percentSpent = budgetLimit > 0 ? Math.min(100, Math.round((totalSpent / budgetLimit) * 100)) : 0;
  const isOver = remaining < 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
              Financial Intelligence
            </span>
            <span className="text-xs text-slate-400">Real-Time Aggregations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Budget & Expense Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Trip: <strong className="text-teal-300">{activeTrip.name}</strong> • Target Cap: {formatCurrency(budgetLimit)}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('itinerary')}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-semibold backdrop-blur-md transition"
          >
            Back to Itinerary
          </button>
        </div>
      </div>

      {/* 1. Summary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget Card */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Budget</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{formatCurrency(budgetLimit)}</div>
          <div className="text-[11px] text-slate-400 font-medium">Original allocation target</div>
        </div>

        {/* Total Spent Card */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Spent</span>
            <CreditCard className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-teal-300">{formatCurrency(totalSpent)}</div>
          <div className="text-[11px] text-slate-400 font-medium">{percentSpent}% of total budget</div>
        </div>

        {/* Remaining Budget Card */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Remaining</span>
            {isOver ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className={`text-2xl font-black ${isOver ? 'text-rose-400' : 'text-emerald-300'}`}>
            {formatCurrency(remaining)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {isOver ? 'Over budget target!' : 'Safe buffer remaining'}
          </div>
        </div>

        {/* Daily Average Cost Card */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Daily Average</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {formatCurrency(summary?.daily_average_spent || 0)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Per travel day burned</div>
        </div>
      </div>

      {/* 2. Visual Charts & Category Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Spending Donut Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-400" />
              <span>Category Allocation Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{chartData.length} active buckets</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="h-64 relative">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => formatCurrency(val)}
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  No logged expenses yet.
                </div>
              )}
              {/* Centered Total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Spent</span>
                <span className="text-sm font-black text-teal-300">{formatCurrency(totalSpent)}</span>
              </div>
            </div>

            {/* Category Cards List */}
            <div className="space-y-2">
              {(summary?.by_category || []).map(cat => (
                <div
                  key={cat.category}
                  className="p-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#fff' }}
                    />
                    <span className="font-bold text-slate-200">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{formatCurrency(cat.amount)}</div>
                    <div className="text-[10px] text-slate-400">{Math.round(cat.percentage)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Add Expense Form */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Log New Expense</span>
          </h3>

          <form onSubmit={handleAddExpense} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              >
                <option value="Transport" className="bg-slate-900">Transport (Flights/Trains/Taxis)</option>
                <option value="Stay" className="bg-slate-900">Stay (Hotels/Hostels/Villas)</option>
                <option value="Activities" className="bg-slate-900">Activities (Tours/Tickets/Rentals)</option>
                <option value="Meals" className="bg-slate-900">Meals (Dining/Groceries/Drinks)</option>
                <option value="Other" className="bg-slate-900">Other (eSIM/Shopping/Gifts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0.5"
                required
                placeholder="45.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Date</label>
              <input
                type="date"
                required
                value={expenseDate}
                onChange={e => setExpenseDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Seafood paella dinner in Madrid"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-300 hover:to-teal-300 transition"
            >
              Add Expense Entry
            </button>
          </form>
        </div>
      </div>

      {/* 4. Logged Expenses Ledger */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-teal-400" />
            <span>Transaction Receipt History ({activeTrip.expenses?.length || 0} Entries)</span>
          </h3>
        </div>

        {(activeTrip.expenses || []).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(activeTrip.expenses || []).map(exp => (
                  <tr key={exp.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {format(parseISO(exp.expense_date), 'yyyy-MM-dd')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[exp.category]}20`,
                          color: CATEGORY_COLORS[exp.category],
                          borderColor: `${CATEGORY_COLORS[exp.category]}40`
                        }}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{exp.description}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-300">
                      {formatCurrency(Number(exp.amount))}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete Receipt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            No expenses logged yet. Add your flight bookings or hotel receipts above!
          </div>
        )}
      </div>
    </div>
  );
};
