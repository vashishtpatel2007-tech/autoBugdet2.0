"use client";

import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Transaction = {
  id: number;
  user_id: string;
  amount: number;
  category: string;
  date: string; // "yyyy-mm-dd"
};

// Convert a Date → "yyyy-mm-dd" without timezone issues
const formatDate = (d: Date) => d.toLocaleDateString("en-CA");

export default function CalendarPage() {
  const [value, setValue] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailyTotal, setDailyTotal] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setErrorMsg("User not logged in");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        setErrorMsg("Failed to load expenses.");
        setLoading(false);
        return;
      }

      const tx = data || [];
      setTransactions(tx);

      // Compute daily totals
      const totals: Record<string, number> = {};
      tx.forEach((t) => {
        totals[t.date] = (totals[t.date] || 0) + Number(t.amount || 0);
      });

      setDailyTotal(totals);
      setLoading(false);
    };

    load();
  }, []);

  const selectedDateKey = formatDate(value);

  // Memoized filtered transactions
  const dayTransactions = useMemo(
    () => transactions.filter((t) => t.date === selectedDateKey),
    [transactions, selectedDateKey]
  );

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-xl font-semibold mb-4">📅 Calendar</h1>

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <p className="bg-red-700/40 text-red-300 p-3 rounded mb-4">
          {errorMsg}
        </p>
      )}

      {/* CALENDAR */}
      <div className="rounded-xl bg-[#1a1d25] p-4 shadow-lg">
        <Calendar
          onChange={(d) => setValue(d as Date)}
          value={value}
          tileContent={({ date }) => {
            const key = formatDate(date);
            const total = dailyTotal[key];

            return total ? (
              <p className="text-red-400 text-xs font-bold mt-1">₹{total}</p>
            ) : null;
          }}
        />
      </div>

      {/* Add Expense Button */}
      <Link
        href={`/expenses?date=${selectedDateKey}`}
        className="block mt-6 bg-green-500 hover:bg-green-400 text-black text-center py-3 rounded-xl font-semibold shadow-md"
      >
        Add Expense for {value.toDateString()}
      </Link>

      {/* Daily Transactions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">
          Transactions on {value.toDateString()}
        </h2>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && dayTransactions.length === 0 && (
          <p className="text-gray-400 text-sm">No expenses for this day.</p>
        )}

        {dayTransactions.map((t) => (
          <div
            key={t.id}
            className="mt-3 p-4 bg-[#14161d] rounded-lg border border-gray-700"
          >
            <p className="font-semibold">{t.category}</p>
            <p className="text-red-400 font-bold">- ₹{t.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
