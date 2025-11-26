"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AddExpense() {
  const params = useSearchParams();

  const prefilledDate =
    params.get("date") || new Date().toISOString().slice(0, 10);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(prefilledDate);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const normalizeDate = (d: string) => {
    try {
      return new Date(d).toISOString().slice(0, 10);
    } catch {
      return prefilledDate;
    }
  };

  const submit = async () => {
    setErrorMsg("");
    setSuccess(false);

    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Enter a valid amount");
      return;
    }

    const fixedDate = normalizeDate(date);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setErrorMsg("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      amount: Number(amount),
      category,
      note,
      date: fixedDate,
      type: "Expense",
    });

    if (error) {
      console.log(error);
      setErrorMsg("Failed to save expense.");
      return;
    }

    setSuccess(true);
    setAmount("");
    setNote("");
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Expense</h1>

      <label className="block mb-1 text-gray-300">Amount (₹)</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 rounded bg-gray-800 mb-4"
      />

      <label className="block mb-1 text-gray-300">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 rounded bg-gray-800 mb-4"
      >
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Entertainment</option>
        <option>Health</option>
        <option>Other</option>
      </select>

      <label className="block mb-1 text-gray-300">Note</label>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-3 rounded bg-gray-800 mb-4"
        placeholder="Description..."
      />

      <label className="block mb-1 text-gray-300">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-3 rounded bg-gray-800 mb-6"
      />

      {errorMsg && <p className="text-red-400">{errorMsg}</p>}
      {success && <p className="text-green-400">Expense added!</p>}

      <button
        onClick={submit}
        className="w-full py-3 bg-green-500 text-black rounded-xl font-semibold"
      >
        Save Expense
      </button>

      <Link href="/calendar" className="mt-6 block text-green-400 underline">
        Back to Calendar
      </Link>
    </div>
  );
}
