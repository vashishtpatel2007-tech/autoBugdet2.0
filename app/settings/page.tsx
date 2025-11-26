"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function SettingsPage() {
  const supabase = createClient();
  const [budget, setBudget] = useState("");
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const month = new Date().toISOString().slice(0, 7); // 2025-11

    await supabase.from("budgets").upsert({
      user_id: userData.user.id,
      month,
      budget: Number(budget),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">Settings</h1>

      <label>Monthly Budget</label>
      <input
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="w-full mt-2 p-3 rounded bg-gray-800"
        type="number"
      />

      <button
        onClick={save}
        className="mt-4 w-full py-3 bg-green-500 text-black rounded"
      >
        Save Budget
      </button>

      {saved && (
        <p className="mt-3 text-green-400">Saved!</p>
      )}
    </div>
  );
}
