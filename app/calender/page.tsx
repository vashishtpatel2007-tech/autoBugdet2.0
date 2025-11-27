"use client";

import { useEffect, useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Keep this for base structure
import "@/styles/calendar-dark.css"; // <-- ADD THIS FOR DARK MODE STYLES
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// Transaction type
type Transaction = {
  id: number;
  user_id: string;
  amount: number;
  category: string;
  date: string; // yyyy-mm-dd
};

// Fallback type for react-calendar tile function
type TileProps = {
  date: Date;
  view: string;
};

export default function CalendarPage() {
  const [value, setValue] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailyTotal, setDailyTotal] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true); // <-- Added Loading State
  const [error, setError] = useState<string | null>(null); // <-- Added Error State

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          // Handle unauthenticated state if necessary (e.g., redirect)
          setIsLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id);
        
        if (fetchError) {
          console.error("Calendar Fetch Error:", fetchError);
          setError("Failed to load transactions.");
          setIsLoading(false);
          return;
        }

        const tx: Transaction[] = data || [];
        setTransactions(tx);

        // Calculate day-wise totals
        const totals: Record<string, number> = {};
        tx.forEach((t) => {
          // Ensure amount is treated as a number
          const amount = Number(t.amount || 0); 
          const key = t.date;
          totals[key] = (totals[key] || 0) + amount;
        });

        setDailyTotal(totals);
      } catch (e) {
        console.error("Unexpected error during transaction load:", e);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Use useMemo to prevent unnecessary recalculation on every render
  const selectedDateKey = useMemo(() => value.toISOString().split("T")[0], [value]);

  // Use useMemo to filter daily transactions only when 'transactions' or 'selectedDateKey' changes
  const dailyTransactions = useMemo(() => {
    return transactions.filter((t) => t.date === selectedDateKey);
  }, [transactions, selectedDateKey]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <h1 className="text-xl font-semibold mb-4">📅 Calendar</h1>
        <p className="text-red-500">{error}</p>
        <p className="text-gray-400 text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-xl font-semibold mb-4">📅 Expense Calendar</h1>

      {/* CALENDAR */}
      <div className="rounded-xl bg-[#1a1d25] p-4 shadow-lg">
        {/* Added 'calendar-dark' className for custom dark mode styles */}
        <Calendar
          className="calendar-dark" 
          onChange={(d) => setValue(d as Date)}
          value={value}
          tileContent={(props: TileProps) => {
            if (props.view !== 'month') return null; // Only show totals on the month view
            
            const key = props.date.toISOString().split("T")[0];
            // Format number to two decimal places if needed, or keep it simple
            const total = dailyTotal[key]; 

            return total ? (
              // Use a dynamic class based on total for potential color coding (e.g., red for expense)
              <p className="text-red-400 text-xs font-bold mt-1">₹{total.toFixed(0)}</p>
            ) : null;
          }}
        />
      </div>

      {/* Add Expense Button */}
      <Link
        href={`/expenses?date=${selectedDateKey}`}
        className="block mt-6 bg-green-500 hover:bg-green-400 text-black text-center py-3 rounded-xl font-semibold shadow-md transition-colors"
      >
        Add Expense for **{value.toDateString()}**
      </Link>

      {/* Daily Transactions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">
          Transactions on **{value.toDateString()}**
        </h2>

        {dailyTransactions.length === 0 && (
          <p className="text-gray-400 text-sm">No expenses for this day.</p>
        )}

        {dailyTransactions.map((t) => (
          <div
            key={t.id}
            className="mt-3 p-4 bg-[#14161d] rounded-lg border border-gray-700 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{t.category}</p>
            </div>
            <p className="text-red-400 text-lg font-bold">
              - ₹{t.amount.toFixed(2)} {/* Added toFixed(2) for currency format */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
