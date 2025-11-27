"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function SettingsPage() {
  const supabase = createClient();

  // BUDGET SETTINGS
  const [budgetType, setBudgetType] = useState<"monthly" | "weekly">("monthly");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [saved, setSaved] = useState(false);

  // THEME
  const [theme, setTheme] = useState("neon");

  // NOTIFICATIONS
  const [overspendAlert, setOverspendAlert] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);

  const saveSettings = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const month = new Date().toISOString().slice(0, 7);

    await supabase.from("budgets").upsert({
      user_id: userData.user.id,
      month,
      budget: Number(budgetAmount),
      cycle: budgetType,
      theme,
      overspend_alert: overspendAlert,
      daily_summary: dailyReminder,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="min-h-screen p-6 text-white bg-black">
      <h1 className="text-3xl font-bold mb-6">Settings ⚙️</h1>

      {/* BUDGET TYPE */}
      <div className="bg-[#12131a] p-5 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Budget Cycle</h2>

        <div className="flex gap-4">
          <button
            className={`px-5 py-2 rounded-full ${
              budgetType === "monthly"
                ? "bg-green-500 text-black"
                : "bg-gray-700"
            }`}
            onClick={() => setBudgetType("monthly")}
          >
            Monthly
          </button>

          <button
            className={`px-5 py-2 rounded-full ${
              budgetType === "weekly"
                ? "bg-green-500 text-black"
                : "bg-gray-700"
            }`}
            onClick={() => setBudgetType("weekly")}
          >
            Weekly
          </button>
        </div>

        <p className="text-gray-400 mt-3">
          Choose how you want your spending limit to work.
        </p>
      </div>

      {/* BUDGET AMOUNT */}
      <div className="bg-[#12131a] p-5 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-3">Budget Amount</h2>
        <input
          type="number"
          placeholder="Enter budget (₹)"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 mb-4"
        />
      </div>

      {/* THEME SETTINGS */}
      <div className="bg-[#12131a] p-5 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-3">Theme</h2>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        >
          <option value="neon">Neon (default)</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-[#12131a] p-5 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>

        <div className="flex items-center justify-between mb-4">
          <p>Overspending Alerts</p>
          <input
            type="checkbox"
            checked={overspendAlert}
            onChange={() => setOverspendAlert(!overspendAlert)}
            className="w-6 h-6"
          />
        </div>

        <div className="flex items-center justify-between">
          <p>Daily Expense Summary</p>
          <input
            type="checkbox"
            checked={dailyReminder}
            onChange={() => setDailyReminder(!dailyReminder)}
            className="w-6 h-6"
          />
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={saveSettings}
        className="w-full py-3 bg-green-500 text-black font-semibold rounded-xl"
      >
        Save Settings
      </button>

      {saved && <p className="text-green-400 mt-3">Settings saved!</p>}

      {/* RESET DATA */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3 text-red-400">Danger Zone</h2>
        <button className="w-full py-3 bg-red-600 text-white rounded-xl">
          Reset All Data
        </button>
      </div>
    </div>
  );
}
