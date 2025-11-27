"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="w-full bg-[#0f0f17] p-4 flex justify-between text-white items-center">
      <Link href="/dashboard" className="text-green-400 text-xl font-semibold">
        AutoBudget
      </Link>

      <div className="flex gap-6 text-gray-300">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/calendar">Calendar</Link>
        <Link href="/expenses">Add Expense</Link>
        <Link href="/analysis/weekly">Weekly</Link>
        <Link href="/analysis/monthly">Monthly</Link>
        <Link href="/settings">Settings</Link>
      </div>

      {/* RIGHT SIDE: LOGIN / LOGOUT */}
      {!loading ? (
        user ? (
          <button
            onClick={async () => {
              const { supabase } = await import("@/lib/supabaseClient");
              await supabase.auth.signOut();
              window.location.href = "/auth/login";
            }}
            className="text-red-400"
          >
            Logout
          </button>
        ) : (
          <Link href="/auth/login" className="text-green-400">
            Login
          </Link>
        )
      ) : (
        <div className="text-gray-500">...</div>
      )}
    </nav>
  );
}
