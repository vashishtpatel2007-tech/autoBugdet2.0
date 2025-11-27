"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
const supabase = createClient();
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import Link from "next/link";

type Transaction = {
  id: number;
  user_id: string;
  amount: number;
  category: string;
  date: string; // ISO date
  type?: string;
};

const NEON_GREEN = "#8fff3f";
const NEON_YELLOW = "#f7ff3c";
const DARK_BG = "#050812";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();

      // → Get logged-in user
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      setUserEmail(user.email ?? null);

      // → Fetch user-specific transactions
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)        // IMPORTANT: MUST MATCH COLUMN NAME
        .order("date", { ascending: true });

      if (error) {
        console.log("Supabase Fetch Error:", error);
        setLoading(false);
        return;
      }

      // Normalizing values
      const cleaned = (data ?? []).map((t: any) => ({
        ...t,
        amount: Number(t.amount ?? 0),
        date: t.date,
      }));

      setTransactions(cleaned);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  // Helpers
  const today = new Date();
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 6
  );
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  function isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  // Convert string date to JS date
  const txWithDates = transactions.map((t) => ({
    ...t,
    jsDate: new Date(t.date),
  }));

  // Filter only expenses
  const expenses = txWithDates.filter(
    (t) => (t.type ?? "Expense") === "Expense"
  );

  // Monthly total
  const totalThisMonth = expenses
    .filter((t) => t.jsDate >= startOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  // Weekly total
  const totalThisWeek = expenses
    .filter((t) => t.jsDate >= startOfWeek)
    .reduce((sum, t) => sum + t.amount, 0);

  // Today
  const totalToday = expenses
    .filter((t) => isSameDay(t.jsDate, today))
    .reduce((sum, t) => sum + t.amount, 0);

  // Line chart (7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));

    const sum = expenses
      .filter((t) => isSameDay(t.jsDate, d))
      .reduce((s, t) => s + t.amount, 0);

    return {
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      amount: sum,
    };
  });

  // Pie chart
  const categoryMap = new Map<string, number>();
  expenses
    .filter((t) => t.jsDate >= startOfMonth)
    .forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount);
    });

  const categoryData = Array.from(categoryMap.entries()).map(
    ([name, value]) => ({ name, value })
  );

  // Bar chart (monthly summary)
  const monthMap = new Map<string, number>();
  expenses.forEach((t) => {
    const key = `${t.jsDate.getMonth() + 1}/${t.jsDate.getFullYear()}`;
    monthMap.set(key, (monthMap.get(key) ?? 0) + t.amount);
  });

  const monthData = Array.from(monthMap.entries()).map(([month, total]) => ({
    month,
    total,
  }));

  const PIE_COLORS = [NEON_GREEN, NEON_YELLOW, "#37ffb1", "#51a6ff", "#ff7af6"];
// Load budget for this user
const [budget, setBudget] = useState<number | null>(null);
const [cycle, setCycle] = useState<string>("monthly");
const [overspendAlertEnabled, setOverspendAlertEnabled] = useState(false);

useEffect(() => {
  async function loadBudget() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const month = new Date().toISOString().slice(0, 7);

    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .single();

    if (data) {
      setBudget(data.budget);
      setCycle(data.cycle);
      setOverspendAlertEnabled(data.overspend_alert);
    }
  }

  loadBudget();
}, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: `radial-gradient(circle at top, #101725, ${DARK_BG})` }}
    >
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-[0.25em]">
              AUTOBUDGET • OVERVIEW
            </p>
            <h1 className="text-3xl font-semibold">
              Hello{userEmail ? `, ${userEmail.split("@")[0]}` : ""} 👋
            </h1>
            <p className="text-gray-400 mt-1">
              Here’s a neon-bright snapshot of your spending.
            </p>
          </div>

          <Link
            href="/expenses"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-semibold shadow-[0_0_20px_#84ff3b]"
          >
            + Add Expense
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <NeonCard title="This Month Spent" value={`₹${totalThisMonth}`} />
          <NeonCard title="This Week Spent" value={`₹${totalThisWeek}`} />
          <NeonCard title="Today" value={`₹${totalToday}`} />
        </div>

        {/* No transactions */}
        {transactions.length === 0 && !loading && (
          <div className="text-center mt-12 text-gray-400">
            No transactions yet. Start by{" "}
            <Link href="/expenses" className="text-green-400 underline">
              adding your first expense
            </Link>
            .
          </div>
        )}

        {/* Charts */}
        {transactions.length > 0 && (
          <>
            {/* Weekly Trend + Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Weekly Trend */}
              <div className="col-span-2 bg-[#070b18] rounded-2xl border border-[#1c263f] p-4">
                <h2 className="text-sm text-gray-300 mb-2">Weekly Trend</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={last7Days}>
                    <CartesianGrid stroke="#1b2640" />
                    <XAxis dataKey="label" stroke="#8b9bbd" />
                    <YAxis stroke="#8b9bbd" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={NEON_GREEN}
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Category Split */}
              <div className="bg-[#070b18] rounded-2xl border border-[#1c263f] p-4">
                <h2 className="text-sm text-gray-300 mb-2">Category Split</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly + AI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Monthly */}
              <div className="col-span-2 bg-[#070b18] rounded-2xl border border-[#1c263f] p-4">
                <h2 className="text-sm text-gray-300 mb-2">Monthly Overview</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthData}>
                    <CartesianGrid stroke="#1b2640" />
                    <XAxis dataKey="month" stroke="#8b9bbd" />
                    <YAxis stroke="#8b9bbd" />
                    <Tooltip />
                    <Bar dataKey="total" fill={NEON_GREEN} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* AI Insight */}
              <div className="bg-gradient-to-br from-[#101f30] to-[#020612] rounded-2xl border border-[#1c263f] p-5">
                <p className="text-xs text-gray-300 mb-2">AI Insight</p>
                <h3 className="text-lg font-semibold mb-3">
                  You're on track 🎯
                </h3>
                <p className="text-sm text-gray-300">
                  Your spending looks{" "}
                  <span className="text-green-400">stable</span>. Keep an eye on{" "}
                  <span className="text-emerald-300">Food + Shopping</span>.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function NeonCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#222c46] bg-gradient-to-br from-[#0b111f] via-[#050814] to-[#020309] p-4 shadow-xl">
      <p className="text-xs text-gray-400 mb-1 uppercase">{title}</p>
      <p className="text-2xl font-semibold text-lime-300">{value}</p>
    </div>
  );
}
