"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewTransaction() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load user when page opens
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    }
    loadUser();
  }, []);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("expense");
  const [message, setMessage] = useState("");

  async function handleAdd() {
    if (!currentUser) {
      setMessage("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      user_id: currentUser.id,
      amount,
      category,
      note,
      date,
      type,
    });

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/transactions");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex justify-center">
      <div className="bg-slate-800 p-6 rounded-xl w-full max-w-lg border border-slate-700">
        <h1 className="text-2xl font-semibold mb-4">Add Transaction</h1>

        <input
          type="number"
          placeholder="Amount"
          className="w-full mb-3 p-3 bg-slate-700 rounded border border-slate-600"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          className="w-full mb-3 p-3 bg-slate-700 rounded border border-slate-600"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Shopping</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Health</option>
          <option>Other</option>
        </select>

        <input
          type="text"
          placeholder="Note (optional)"
          className="w-full mb-3 p-3 bg-slate-700 rounded border border-slate-600"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <input
          type="date"
          className="w-full mb-3 p-3 bg-slate-700 rounded border border-slate-600"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          className="w-full mb-3 p-3 bg-slate-700 rounded border border-slate-600"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button
          onClick={handleAdd}
          className="w-full mt-2 p-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>

        {message && (
          <p className="mt-3 text-gray-300 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
