"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Transaction = {
  id: number;
  amount: number;
  category: string;
  date: string;
  type?: string;
  user_id: string;
};

export default function MonthlyPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      setTransactions((data as Transaction[]) || []);
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-semibold mb-4">Monthly Analysis</h1>

      <p className="text-gray-400 mb-6">All expenses for this month.</p>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p>No transactions found!</p>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="p-4 bg-gray-900 rounded-xl border border-gray-700"
            >
              <div className="flex justify-between">
                <span>{t.category}</span>
                <span className="text-red-400">₹{t.amount}</span>
              </div>
              <p className="text-gray-500 text-sm">{t.date}</p>
            </div>
          ))
        )}
      </div>

      <Link href="/dashboard" className="block mt-8 text-green-400 underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
