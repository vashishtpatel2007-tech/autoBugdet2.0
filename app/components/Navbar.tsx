"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <nav className="w-full bg-[#0b0f17] p-4 flex justify-between text-white">
      <Link href="/dashboard" className="text-green-400 font-semibold text-xl">
        AutoBudget
      </Link>

      <div className="flex gap-6">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/expenses">Add Expense</Link>
        <Link href="/analysis/weekly">Weekly</Link>
        <Link href="/analysis/monthly">Monthly</Link>

        {user ? (
          <button onClick={logout} className="text-red-400">
            Logout
          </button>
        ) : (
          <Link href="/auth/login" className="text-green-400">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
