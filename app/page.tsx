"use client";

import { useAuth } from "@/app/providers/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">

        {/* User info */}
        <p className="text-gray-400 mb-4">
          Logged in as: {user?.email ?? "Not logged in"}
        </p>

        {/* Main dashboard card */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-10">
          {/* Browser-style bar */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-3 text-xs text-gray-400 uppercase tracking-widest">
              AutoBudget • Prototype
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-3">
            1. Automated Budgeting & Insights
          </h1>

          <p className="text-gray-300 mb-6">
            Mobile app for real-time personal budgeting, expense tracking,
            savings planning, and instant data visualization — powered by AI.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
              <p className="text-xs text-gray-400 uppercase">This Month Spent</p>
              <p className="text-xl font-semibold">₹18,240</p>
              <p className="text-xs text-gray-400 mt-1">+12% vs last month</p>
            </div>

            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
              <p className="text-xs text-gray-400 uppercase">Saved So Far</p>
              <p className="text-xl font-semibold">₹4,500</p>
              <p className="text-xs text-gray-400 mt-1">45% of goal</p>
            </div>

            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
              <p className="text-xs text-gray-400 uppercase">Budget Health</p>
              <p className="text-xl font-semibold">🟢 Good</p>
              <p className="text-xs text-gray-400 mt-1">Food slightly high</p>
            </div>

          </div>

          {/* 2 Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
              <h2 className="text-sm font-semibold mb-2">Category Breakdown</h2>
              <p className="text-xs text-gray-300">Here we’ll show bar/pie chart from your data.</p>
            </div>

            <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
              <h2 className="text-sm font-semibold mb-2">AI Insight</h2>
              <p className="text-xs text-gray-300">
                “You are on track to hit your laptop goal by March.”
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
